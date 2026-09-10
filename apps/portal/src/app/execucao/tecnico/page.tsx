"use client";

/*
 * ETAPA32F_TECNICO_PADRAO
 *
 * MASTER / ROOT:
 *
 * gerenciamento cross-company de
 * FieldTechnicianProfile.
 *
 * Nenhuma definição de tools/vehicle
 * é realizada nesta etapa.
 */

import {
  useEffect,
  useMemo,
  useState,
} from "react";


type CompanyUserRole = {
  Role?: {
    name?: string | null;
  } | null;
};


type CompanyUser = {
  id: string;

  name?: string | null;

  email?: string | null;

  isActive?: boolean;

  whatsapp?: string | null;

  UserRole?: CompanyUserRole[];
};


type PlatformCompany = {
  id: string;

  name: string;

  isActive?: boolean;

  status?: string | null;

  User?: CompanyUser[];
};


type TechnicianUser = {
  id?: string;

  name?: string | null;

  email?: string | null;

  isActive?: boolean;
};


type Technician = {
  id: string;

  companyId?: string;

  userId: string;

  cboCode?: string | null;

  registration?: string | null;

  phone?: string | null;

  whatsapp?: string | null;

  city?: string | null;

  state?: string | null;

  document?: string | null;

  specialties?: string[];

  isActive?: boolean;

  User?: TechnicianUser | null;
};


function getApiUrl() {

  const apiUrl =
    process.env
      .NEXT_PUBLIC_API_URL;

  if (!apiUrl) {

    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada."
    );

  }

  return apiUrl;
}


async function authorizedFetch(
  endpoint: string,
  options: RequestInit = {}
) {

  const token =
    localStorage.getItem(
      "token"
    );


  if (!token) {

    throw new Error(
      "Sessão não encontrada."
    );

  }


  const response =
    await fetch(
      `${getApiUrl()}${endpoint}`,
      {
        ...options,

        cache:
          "no-store",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

          ...(options.headers ||
            {}),
        },
      }
    );


  const raw =
    await response.text();


  let data: unknown =
    null;


  try {

    data =
      raw
        ? JSON.parse(raw)
        : null;

  } catch {

    data =
      raw;

  }


  if (!response.ok) {

    let message =
      "";


    if (
      data &&
      typeof data === "object" &&
      "message" in data
    ) {

      const value =
        (
          data as {
            message?: unknown;
          }
        ).message;


      if (Array.isArray(value)) {

        message =
          value
            .map(String)
            .join(", ");

      } else if (
        value !== undefined &&
        value !== null
      ) {

        message =
          String(value);

      }

    }


    throw new Error(
      message ||
      `API_${response.status}`
    );

  }


  return data;
}


function getUserRole(
  user: CompanyUser
) {

  return (
    user.UserRole?.[0]?.Role?.name ||
    "USUÁRIO"
  );
}


export default function TecnicoPadraoPage() {

  const [
    companies,
    setCompanies,
  ] =
    useState<PlatformCompany[]>(
      []
    );


  const [
    selectedCompanyId,
    setSelectedCompanyId,
  ] =
    useState("");


  const [
    technicians,
    setTechnicians,
  ] =
    useState<Technician[]>(
      []
    );


  const [
    loadingCompanies,
    setLoadingCompanies,
  ] =
    useState(true);


  const [
    loadingTechnicians,
    setLoadingTechnicians,
  ] =
    useState(false);


  const [
    actionUserId,
    setActionUserId,
  ] =
    useState("");


  const [
    actionTechnicianId,
    setActionTechnicianId,
  ] =
    useState("");


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState("");


  const selectedCompany =
    useMemo(
      () =>
        companies.find(
          company =>
            company.id ===
            selectedCompanyId
        ) || null,
      [
        companies,
        selectedCompanyId,
      ]
    );


  const companyUsers =
    useMemo(
      () =>
        Array.isArray(
          selectedCompany?.User
        )
          ? selectedCompany!.User!
          : [],
      [
        selectedCompany,
      ]
    );


  const technicianUserIds =
    useMemo(
      () =>
        new Set(
          technicians.map(
            technician =>
              technician.userId
          )
        ),
      [
        technicians,
      ]
    );


  const availableUsers =
    useMemo(
      () =>
        companyUsers.filter(
          user =>
            !technicianUserIds.has(
              user.id
            )
        ),
      [
        companyUsers,
        technicianUserIds,
      ]
    );


  async function loadCompanies() {

    try {

      setLoadingCompanies(
        true
      );

      setError("");


      const data =
        await authorizedFetch(
          "/admin/companies"
        );


      const list =
        Array.isArray(data)
          ? (
              data as
                PlatformCompany[]
            )
          : [];


      setCompanies(
        list
      );


      setSelectedCompanyId(
        current => {

          if (
            current &&
            list.some(
              item =>
                item.id === current
            )
          ) {

            return current;

          }


          const active =
            list.find(
              item =>
                item.isActive !==
                false
            );


          return (
            active?.id ||
            list[0]?.id ||
            ""
          );

        }
      );

    } catch (err) {

      console.error(
        "TECHNICIAN COMPANIES ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as empresas."
      );

    } finally {

      setLoadingCompanies(
        false
      );

    }

  }


  async function loadTechnicians(
    companyId: string
  ) {

    if (!companyId) {

      setTechnicians(
        []
      );

      return;

    }


    try {

      setLoadingTechnicians(
        true
      );

      setError("");


      const data =
        await authorizedFetch(
          `/field-technicians/platform/company/${encodeURIComponent(
            companyId
          )}`
        );


      setTechnicians(
        Array.isArray(data)
          ? (
              data as
                Technician[]
            )
          : []
      );

    } catch (err) {

      console.error(
        "TECHNICIANS LOAD ERROR:",
        err
      );


      setTechnicians(
        []
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os técnicos."
      );

    } finally {

      setLoadingTechnicians(
        false
      );

    }

  }


  useEffect(
    () => {

      void loadCompanies();

    },
    []
  );


  useEffect(
    () => {

      if (!selectedCompanyId) {

        setTechnicians(
          []
        );

        return;

      }


      void loadTechnicians(
        selectedCompanyId
      );

    },
    [
      selectedCompanyId,
    ]
  );


  async function defineTechnician(
    user: CompanyUser
  ) {

    if (!selectedCompanyId) {

      setError(
        "Selecione uma empresa."
      );

      return;

    }


    try {

      setActionUserId(
        user.id
      );

      setError("");

      setSuccess("");


      await authorizedFetch(
        `/field-technicians/platform/company/${encodeURIComponent(
          selectedCompanyId
        )}`,
        {
          method:
            "POST",

          body:
            JSON.stringify({
              userId:
                user.id,
            }),
        }
      );


      await loadTechnicians(
        selectedCompanyId
      );


      setSuccess(
        `${
          user.name ||
          user.email ||
          "Usuário"
        } definido como técnico.`
      );

    } catch (err) {

      console.error(
        "TECHNICIAN CREATE ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível definir o técnico."
      );

    } finally {

      setActionUserId("");

    }

  }


  async function removeTechnician(
    technician: Technician
  ) {

    if (
      !selectedCompanyId
    ) {

      return;

    }


    const technicianName =
      technician.User?.name ||
      technician.User?.email ||
      "este técnico";


    if (
      !window.confirm(
        `Remover o perfil técnico de "${technicianName}"?`
      )
    ) {

      return;

    }


    try {

      setActionTechnicianId(
        technician.id
      );

      setError("");

      setSuccess("");


      await authorizedFetch(
        `/field-technicians/platform/company/${encodeURIComponent(
          selectedCompanyId
        )}/${encodeURIComponent(
          technician.id
        )}`,
        {
          method:
            "DELETE",
        }
      );


      await loadTechnicians(
        selectedCompanyId
      );


      setSuccess(
        "Perfil técnico removido."
      );

    } catch (err) {

      console.error(
        "TECHNICIAN DELETE ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível remover o perfil técnico."
      );

    } finally {

      setActionTechnicianId(
        ""
      );

    }

  }


  return (

    <main
      className="
        space-y-6
      "
    >

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-cyan-400
              "
            >
              Execução
            </div>

            <h1
              className="
                mt-2
                text-3xl
                font-black
                text-white
              "
            >
              Técnico Padrão
            </h1>

            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                text-slate-400
              "
            >
              Gerencie os técnicos cadastrados
              por empresa na plataforma GeoFiber.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              void loadCompanies()
            }
            disabled={
              loadingCompanies
            }
            className="
              rounded-xl
              border
              border-slate-700
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-200
              transition
              hover:border-cyan-500
              hover:text-cyan-300
              disabled:opacity-50
            "
          >
            {loadingCompanies
              ? "Atualizando..."
              : "Atualizar"}
          </button>

        </div>

      </section>


      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            grid
            gap-4
            lg:grid-cols-[minmax(0,1fr)_220px_220px]
          "
        >

          <div>

            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Empresa
            </div>


            <select
              value={
                selectedCompanyId
              }
              onChange={
                event => {

                  setSuccess("");

                  setError("");

                  setSelectedCompanyId(
                    event.target.value
                  );

                }
              }
              disabled={
                loadingCompanies ||
                companies.length === 0
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-sm
                font-bold
                text-white
                outline-none
                transition
                focus:border-cyan-500
                disabled:opacity-50
              "
            >

              {companies.length === 0 ? (

                <option value="">
                  Nenhuma empresa encontrada
                </option>

              ) : (

                companies.map(
                  company => (

                    <option
                      key={
                        company.id
                      }
                      value={
                        company.id
                      }
                    >
                      {company.name}
                      {
                        company.isActive ===
                        false
                          ? " — INATIVA"
                          : ""
                      }
                    </option>

                  )
                )

              )}

            </select>


            <div
              className="
                mt-2
                break-all
                text-xs
                text-slate-600
              "
            >
              {selectedCompanyId ||
                "Empresa não selecionada"}
            </div>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/50
              p-4
            "
          >

            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Usuários
            </div>

            <div
              className="
                mt-2
                text-3xl
                font-black
                text-white
              "
            >
              {companyUsers.length}
            </div>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/50
              p-4
            "
          >

            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Técnicos
            </div>

            <div
              className="
                mt-2
                text-3xl
                font-black
                text-cyan-400
              "
            >
              {technicians.length}
            </div>

          </div>

        </div>

      </section>


      {error ? (

        <div
          className="
            rounded-2xl
            border
            border-red-900/50
            bg-red-950/30
            p-4
            text-sm
            text-red-300
          "
        >
          {error}
        </div>

      ) : null}


      {success ? (

        <div
          className="
            rounded-2xl
            border
            border-emerald-900/50
            bg-emerald-950/30
            p-4
            text-sm
            text-emerald-300
          "
        >
          {success}
        </div>

      ) : null}


      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            mb-5
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-black
                text-white
              "
            >
              Técnicos da Empresa
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Perfis técnicos já cadastrados.
            </p>

          </div>


          {loadingTechnicians ? (

            <div
              className="
                text-sm
                font-bold
                text-cyan-400
              "
            >
              Carregando...
            </div>

          ) : null}

        </div>


        {!loadingTechnicians &&
        technicians.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-700
              p-8
              text-center
              text-sm
              text-slate-500
            "
          >
            Nenhum técnico cadastrado
            para esta empresa.
          </div>

        ) : (

          <div
            className="
              grid
              gap-4
              xl:grid-cols-2
            "
          >

            {technicians.map(
              technician => (

                <article
                  key={
                    technician.id
                  }
                  className="
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/40
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <div
                      className="
                        min-w-0
                      "
                    >

                      <div
                        className="
                          truncate
                          text-lg
                          font-black
                          text-white
                        "
                      >
                        {
                          technician
                            .User
                            ?.name ||
                          "Técnico"
                        }
                      </div>


                      <div
                        className="
                          mt-1
                          truncate
                          text-sm
                          text-slate-500
                        "
                      >
                        {
                          technician
                            .User
                            ?.email ||
                          "Sem e-mail"
                        }
                      </div>

                    </div>


                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-black
                        uppercase
                        ${
                          technician.isActive ===
                          false
                            ? "bg-red-500/10 text-red-300"
                            : "bg-emerald-500/10 text-emerald-300"
                        }
                      `}
                    >
                      {
                        technician.isActive ===
                        false
                          ? "INATIVO"
                          : "ATIVO"
                      }
                    </span>

                  </div>


                  <div
                    className="
                      mt-5
                      grid
                      gap-3
                      text-sm
                      sm:grid-cols-2
                    "
                  >

                    <div>
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        CBO:
                      </span>{" "}
                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {technician.cboCode ||
                          "—"}
                      </span>
                    </div>


                    <div>
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        Registro:
                      </span>{" "}
                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {technician.registration ||
                          "—"}
                      </span>
                    </div>


                    <div>
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        Telefone:
                      </span>{" "}
                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {technician.phone ||
                          "—"}
                      </span>
                    </div>


                    <div>
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        WhatsApp:
                      </span>{" "}
                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {technician.whatsapp ||
                          "—"}
                      </span>
                    </div>


                    <div>
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        Cidade:
                      </span>{" "}
                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {technician.city ||
                          "—"}
                      </span>
                    </div>


                    <div>
                      <span
                        className="
                          text-slate-600
                        "
                      >
                        UF:
                      </span>{" "}
                      <span
                        className="
                          text-slate-300
                        "
                      >
                        {technician.state ||
                          "—"}
                      </span>
                    </div>

                  </div>


                  <div
                    className="
                      mt-5
                      flex
                      justify-end
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        void removeTechnician(
                          technician
                        )
                      }
                      disabled={
                        actionTechnicianId ===
                        technician.id
                      }
                      className="
                        rounded-xl
                        border
                        border-red-900/50
                        px-3
                        py-2
                        text-xs
                        font-bold
                        text-red-300
                        transition
                        hover:bg-red-950/30
                        disabled:opacity-50
                      "
                    >
                      {
                        actionTechnicianId ===
                        technician.id
                          ? "Removendo..."
                          : "Remover perfil técnico"
                      }
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>


      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            mb-5
          "
        >

          <h2
            className="
              text-xl
              font-black
              text-white
            "
          >
            Usuários Disponíveis
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
            Usuários que ainda não possuem
            perfil de técnico.
          </p>

        </div>


        {availableUsers.length === 0 ? (

          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-700
              p-8
              text-center
              text-sm
              text-slate-500
            "
          >
            Nenhum usuário disponível.
          </div>

        ) : (

          <div
            className="
              space-y-3
            "
          >

            {availableUsers.map(
              user => (

                <div
                  key={
                    user.id
                  }
                  className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/40
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >

                      <span
                        className="
                          font-black
                          text-white
                        "
                      >
                        {user.name ||
                          "Sem nome"}
                      </span>


                      <span
                        className="
                          rounded-full
                          bg-slate-800
                          px-2
                          py-0.5
                          text-[10px]
                          font-black
                          text-slate-400
                        "
                      >
                        {getUserRole(
                          user
                        )}
                      </span>


                      {user.isActive ===
                      false ? (

                        <span
                          className="
                            rounded-full
                            bg-red-500/10
                            px-2
                            py-0.5
                            text-[10px]
                            font-black
                            text-red-300
                          "
                        >
                          INATIVO
                        </span>

                      ) : null}

                    </div>


                    <div
                      className="
                        mt-1
                        truncate
                        text-sm
                        text-slate-500
                      "
                    >
                      {user.email ||
                        "Sem e-mail"}
                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      void defineTechnician(
                        user
                      )
                    }
                    disabled={
                      actionUserId ===
                      user.id
                    }
                    className="
                      shrink-0
                      rounded-xl
                      bg-cyan-500
                      px-4
                      py-2.5
                      text-sm
                      font-black
                      text-slate-950
                      transition
                      hover:bg-cyan-400
                      disabled:opacity-50
                    "
                  >
                    {
                      actionUserId ===
                      user.id
                        ? "Salvando..."
                        : "Definir como Técnico"
                    }
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </main>

  );
}
