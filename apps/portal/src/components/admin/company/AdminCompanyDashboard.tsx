"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

type Company = {
  id?: string;
  name?: string;
  razaoSocial?: string;
  cnpj?: string;
  isActive?: boolean;
};

export default function AdminCompanyDashboard() {
  const params = useParams();
  const router = useRouter();

  const companyId =
    String(params?.company || "");

  const [company, setCompany] =
    useState<Company | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setError("Empresa não identificada.");
      setLoading(false);
      return;
    }

    async function loadCompany() {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/company-management/${companyId}`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `COMPANY_${response.status}`
          );
        }

        const data =
          await response.json();

        setCompany(data);
      } catch (err) {
        console.error(
          "ADMIN COMPANY LOAD ERROR:",
          err
        );

        setError(
          "Não foi possível carregar os dados da empresa."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [
    companyId,
    router,
  ]);

  if (loading) {
    return (
      <div className="p-6">
        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
            p-8
            text-slate-300
          "
        >
          Carregando empresa...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div
          className="
            rounded-2xl
            border
            border-red-900/50
            bg-red-950/30
            p-8
            text-red-300
          "
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-full
        bg-slate-950
        p-4
        sm:p-6
      "
    >
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <div className="text-sm text-slate-500">
            Administração da Empresa
          </div>

          <h1
            className="
              mt-1
              text-2xl
              font-semibold
              text-white
            "
          >
            {company?.name ||
              company?.razaoSocial ||
              "Empresa"}
          </h1>

          <div
            className="
              mt-2
              break-all
              text-xs
              text-slate-500
            "
          >
            ID: {companyId}
          </div>
        </div>

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/${companyId}`
              )
            }
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition
              hover:border-cyan-700
              hover:bg-slate-800
            "
          >
            <div
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Dashboard
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Acessar o dashboard completo da empresa.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/maps?companyId=${companyId}`
              )
            }
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition
              hover:border-cyan-700
              hover:bg-slate-800
            "
          >
            <div
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Mapas
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Acessar a documentação e operação geográfica.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/admin/documents?companyId=${companyId}`
              )
            }
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition
              hover:border-cyan-700
              hover:bg-slate-800
            "
          >
            <div
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              GED / Documentos
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Acessar os documentos da empresa.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/projetos?companyId=${companyId}`
              )
            }
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition
              hover:border-cyan-700
              hover:bg-slate-800
            "
          >
            <div
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Projetos
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Gerenciar os projetos da empresa.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/dashboard/trt?companyId=${companyId}`
              )
            }
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition
              hover:border-cyan-700
              hover:bg-slate-800
            "
          >
            <div
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              TRT
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Acessar a área de TRTs da empresa.
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                `/empresa?companyId=${companyId}`
              )
            }
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-6
              text-left
              transition
              hover:border-cyan-700
              hover:bg-slate-800
            "
          >
            <div
              className="
                text-lg
                font-semibold
                text-white
              "
            >
              Empresa
            </div>

            <div
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Dados e configuração da empresa.
            </div>
          </button>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-950/60
            p-6
          "
        >
          <div
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            Ambiente Enterprise
          </div>

          <div
            className="
              mt-2
              text-sm
              leading-6
              text-slate-400
            "
          >
            Nesta primeira etapa, o ADMIN terá a
            navegação completa do ambiente. As
            restrições por perfil serão aplicadas
            gradualmente em uma etapa posterior.
          </div>
        </div>

      </div>
    </div>
  );
}
