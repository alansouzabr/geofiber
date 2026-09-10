"use client";

import {
  useEffect,
  useState,
} from "react";

import CompaniesTable
  from "../tables/CompaniesTable";

import {
  getCompanies,
  activateCompany,
  deactivateCompany,
  deleteCompany,
} from "../services/admin.service";

import {
  Company,
} from "../types/admin.types";

export default function LiberacaoEmpresas() {

  const [
    companies,
    setCompanies,
  ] = useState<Company[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  async function loadCompanies() {

    try {

      setLoading(true);
      setError("");

      const data =
        await getCompanies();

      /*
       * ETAPA35A19B_LIBERATION_CLIENT_ONLY
       *
       * A Company MASTER representa a própria
       * plataforma e nunca participa do fluxo
       * comercial de liberação.
       */
      setCompanies(
        Array.isArray(data)
          ? data.filter(
              (company: any) =>
                company?.kind === "CLIENT"
            )
          : []
      );

    } catch (err) {

      console.error(
        "LIBERACAO_LOAD_ERROR",
        err
      );

      setError(
        "Não foi possível carregar as empresas."
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    loadCompanies();

  }, []);

  async function onActivate(
    id: string
  ) {

    try {

      await activateCompany(id);

      await loadCompanies();

    } catch (err) {

      console.error(
        "LIBERACAO_ACTIVATE_ERROR",
        err
      );

      setError(
        "Não foi possível liberar a empresa."
      );

    }
  }

  async function onDeactivate(
    id: string
  ) {

    try {

      await deactivateCompany(id);

      await loadCompanies();

    } catch (err) {

      console.error(
        "LIBERACAO_DEACTIVATE_ERROR",
        err
      );

      setError(
        "Não foi possível bloquear a empresa."
      );

    }
  }

  async function onDelete(
    company: Company
  ) {

    const confirmed =
      window.confirm(
        `Deseja realmente excluir a empresa "${company.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      await deleteCompany(
        company.id
      );

      await loadCompanies();

    } catch (err) {

      console.error(
        "LIBERACAO_DELETE_ERROR",
        err
      );

      setError(
        "Não foi possível excluir a empresa."
      );

    }
  }

  const pendingCompanies =
    companies.filter(
      company =>
        company.isActive !== true
    );

  const activeCompanies =
    companies.filter(
      company =>
        company.isActive === true
    );

  return (

    <div
      className="
        w-full
        p-4
        lg:p-8
        text-white
      "
    >

      <div
        className="
          mb-8
          flex
          flex-col
          gap-2
        "
      >

        <h1
          className="
            text-2xl
            lg:text-4xl
            font-black
          "
        >
          Liberação
        </h1>

        <p
          className="
            text-sm
            text-slate-400
          "
        >
          Gerenciamento de empresas aguardando
          aprovação na plataforma.
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
          mb-8
        "
      >

        <div
          className="
            rounded-2xl
            border
            border-cyan-500/30
            bg-slate-900
            p-5
          "
        >

          <p
            className="
              text-sm
              text-slate-400
            "
          >
            Total de empresas
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-black
              text-white
            "
          >
            {companies.length}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-yellow-500/30
            bg-slate-900
            p-5
          "
        >

          <p
            className="
              text-sm
              text-yellow-400
              font-semibold
            "
          >
            Aguardando liberação
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-black
              text-white
            "
          >
            {pendingCompanies.length}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            border
            border-green-500/30
            bg-slate-900
            p-5
          "
        >

          <p
            className="
              text-sm
              text-green-400
              font-semibold
            "
          >
            Empresas ativas
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-black
              text-white
            "
          >
            {activeCompanies.length}
          </p>

        </div>

      </div>

      {error && (

        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-300
          "
        >
          {error}
        </div>

      )}

      <div
        id="empresas-pendentes"
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/40
          p-4
          sm:p-5
        "
      >

        <div
          className="
            mb-5
            flex
            flex-col
            gap-1
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-white
            "
          >
            Empresas para gerenciamento
          </h2>

          <p
            className="
              text-sm
              text-slate-400
            "
          >
            {companies.length}
            {" "}
            empresa(s) cadastrada(s) na plataforma.
          </p>

        </div>

        {loading ? (

          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              p-8
              text-center
              text-sm
              text-slate-400
            "
          >
            Carregando empresas...
          </div>

        ) : companies.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900
              p-8
              text-center
            "
          >

            <p
              className="
                text-base
                font-semibold
                text-green-400
              "
            >
              Nenhuma empresa aguardando liberação.
            </p>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Todas as empresas cadastradas estão
              liberadas.
            </p>

          </div>

        ) : (

          <CompaniesTable
            companies={companies}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
            onDelete={onDelete}
          />

        )}

      </div>

    </div>

  );
}
