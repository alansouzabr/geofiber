"use client";

import {
  useEffect,
  useState,
} from "react";

import Link
  from "next/link";

import {
  Building2,
  FileClock,
  FolderOpen,
  GraduationCap,
  ShieldCheck,
  Unlock,
  Users,
} from "lucide-react";

type PlatformStats = {
  companies: number;
  users: number;
};

export default function MasterPage() {

  const [
    stats,
    setStats,
  ] =
    useState<PlatformStats | null>(
      null
    );

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(() => {

    async function loadStats() {

      const apiUrl =
        process.env
          .NEXT_PUBLIC_API_URL;

      const token =
        localStorage.getItem(
          "token"
        );

      if (!apiUrl) {
        setError(
          "NEXT_PUBLIC_API_URL não configurada."
        );

        return;
      }

      if (!token) {
        setError(
          "Sessão não encontrada."
        );

        return;
      }

      try {

        const response =
          await fetch(
            `${apiUrl}/admin/stats`,
            {
              cache:
                "no-store",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            `API_${response.status}`
          );
        }

        const data =
          await response.json();

        setStats({
          companies:
            Number(
              data?.companies ||
              0
            ),

          users:
            Number(
              data?.users ||
              0
            ),
        });

      } catch (err) {

        console.error(
          "MASTER STATS ERROR:",
          err
        );

        setError(
          "Não foi possível carregar os indicadores da plataforma."
        );
      }
    }

    void loadStats();

  }, []);

  const cards = [
    {
      label: "Empresas",
      value:
        stats
          ? String(
              stats.companies
            )
          : "—",
      href:
        "/master/empresas",
      icon:
        Building2,
      description:
        "Tenants cadastrados na plataforma.",
    },

    {
      label: "Usuários",
      value:
        stats
          ? String(
              stats.users
            )
          : "—",
      href:
        "/usuarios",
      icon:
        Users,
      description:
        "Usuários administrados pela plataforma.",
    },

    {
      label: "Permissões",
      value:
        "RBAC",
      href:
        "/configuracoes/permissoes",
      icon:
        ShieldCheck,
      description:
        "Módulos e permissões liberados por empresa.",
    },

    {
      label: "Auditoria",
      value:
        "LOG",
      href:
        "/auditoria",
      icon:
        FileClock,
      description:
        "Governança e rastreabilidade.",
    },
  ];

  const governance = [
    {
      label:
        "Treinamentos",
      href:
        "/treinamentos",
      icon:
        GraduationCap,
    },

    {
      label:
        "Arquivos / GED",
      href:
        "/arquivos",
      icon:
        FolderOpen,
    },

    {
      label:
        "Liberação",
      href:
        "/dashboard/liberacao",
      icon:
        Unlock,
    },
  ];

  return (
    <main
      className="
        mx-auto
        max-w-[1500px]
        text-white
      "
    >

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-gradient-to-br
          from-[#071528]
          to-[#020817]
          p-6
          lg:p-8
        "
      >

        <div
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.22em]
            text-cyan-400
          "
        >
          GeoFiber Enterprise
        </div>

        <h1
          className="
            mt-3
            text-3xl
            lg:text-4xl
            font-black
          "
        >
          Administração da Plataforma
        </h1>

        <p
          className="
            mt-3
            max-w-3xl
            text-sm
            lg:text-base
            leading-7
            text-slate-400
          "
        >
          Governança central do SaaS,
          empresas, usuários, permissões,
          documentos, treinamentos e
          recursos disponibilizados aos
          tenants GeoFiber.
        </p>

      </section>

      {error && (
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-amber-900/50
            bg-amber-950/20
            px-5
            py-4
            text-sm
            text-amber-300
          "
        >
          {error}
        </div>
      )}

      <section
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >

        {cards.map(
          card => {

            const Icon =
              card.icon;

            return (
              <Link
                key={card.label}
                href={card.href}
                className="
                  group
                  rounded-3xl
                  border
                  border-slate-800
                  bg-[#081223]
                  p-5
                  transition
                  hover:border-cyan-500/50
                  hover:bg-[#0b192c]
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

                  <div>

                    <div
                      className="
                        text-sm
                        font-semibold
                        text-slate-400
                      "
                    >
                      {card.label}
                    </div>

                    <div
                      className="
                        mt-2
                        text-3xl
                        font-black
                        text-white
                      "
                    >
                      {card.value}
                    </div>

                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-cyan-500/10
                      text-cyan-400
                      transition
                      group-hover:bg-cyan-500
                      group-hover:text-slate-950
                    "
                  >
                    <Icon
                      size={21}
                    />
                  </div>

                </div>

                <div
                  className="
                    mt-4
                    text-xs
                    leading-5
                    text-slate-500
                  "
                >
                  {card.description}
                </div>

              </Link>
            );
          }
        )}

      </section>

      <section
        className="
          mt-6
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-7
        "
      >

        <div
          className="
            text-lg
            font-black
            text-white
          "
        >
          Governança da Plataforma
        </div>

        <div
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Recursos globais disponíveis
          para administração MASTER.
        </div>

        <div
          className="
            mt-5
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {governance.map(
            item => {

              const Icon =
                item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-slate-800
                    bg-slate-950/40
                    p-4
                    text-sm
                    font-bold
                    text-slate-300
                    transition
                    hover:border-cyan-500/40
                    hover:text-white
                  "
                >

                  <Icon
                    size={18}
                    className="text-cyan-400"
                  />

                  {item.label}

                </Link>
              );
            }
          )}

        </div>

      </section>

    </main>
  );
}
