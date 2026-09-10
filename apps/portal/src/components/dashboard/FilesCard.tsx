"use client";

import { useContext } from "react";

import { Download, FileText } from "lucide-react";

import {
  AuthContext,
} from "@/context/AuthContext";

interface Props {
  company?: any;
}

export default function FilesCard({
  company,
}: Props) {

  /*
   * ETAPA 35A.6
   *
   * O card inteiro deve respeitar a permissão
   * de Arquivos.
   *
   * Não ocultamos apenas o botão Baixar.
   * Sem acesso, o componente inteiro deixa
   * de ser renderizado.
   */
  const auth =
    useContext(AuthContext);

  const user =
    auth?.user ?? null;

  const permissions =
    user?.permissions ?? [];

  const role =
    String(user?.role || "");

  /*
   * ROOT / MASTER são perfis de plataforma.
   *
   * ADMIN e usuários corporativos não recebem
   * bypass: precisam possuir permissão
   * compatível com Arquivos.
   */
  /*
   * ETAPA 35A.7A
   *
   * A entrada visual em Arquivos exige:
   *
   *   module.files + files.view
   *
   * O download possui permissão própria:
   *
   *   module.files + files.download
   *
   * ROOT / MASTER possuem bypass
   * de plataforma.
   */
  const isPlatformRole =
    role === "ROOT" ||
    role === "MASTER";

  const canViewFiles =
    isPlatformRole ||
    (
      permissions.includes(
        "module.files"
      ) &&
      permissions.includes(
        "files.view"
      )
    );

  const canDownloadFiles =
    isPlatformRole ||
    (
      permissions.includes(
        "module.files"
      ) &&
      permissions.includes(
        "files.download"
      )
    );

  if (!canViewFiles) {
    return null;
  }


  const month = new Intl.DateTimeFormat(
  "pt-BR",
  {
    month: "long",
  },
).format(new Date());

const monthTitle =
  month.charAt(0).toUpperCase() +
  month.slice(1);


  const files = [
    {
      name: "TRT - Maio/2025.pdf",
      path: "trt/2025/trt_maio.pdf",
      date: "05/05/2025",
    },
    {
      name: "Projeto Executivo.dwg",
      path: "projetos/2025/executivo.dwg",
      date: "04/05/2025",
    },
    {
      name: "ART Engenharia.pdf",
      path: "art/2025/art.pdf",
      date: "02/05/2025",
    },
  ];

  return (
    <section
      className="
        rounded-3xl
        border
        border-slate-700
        bg-[#081223]
        p-8
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-cyan-400">
            Telecomunicação — Arquivos Disponíveis
          </h2>

          <p className="mt-2 text-slate-400">
            Últimos documentos disponíveis para download.
          </p>

        </div>

        <div className="text-5xl font-bold text-white">
          {monthTitle}
        </div>

      </div>

      <div className="mt-8 space-y-4">

        {files.map((file) => (

          <div
            key={file.name}
            className="
              flex
              items-center
              justify-between
              rounded-xl
              border
              border-slate-700
              bg-[#0b1728]
              p-5
            "
          >

            <div className="flex items-center gap-4">

              <FileText
                size={28}
                className="text-orange-400"
              />

              <div>

                <div className="font-semibold text-white">
                  {file.name}
                </div>

                <div className="text-sm text-slate-400">
                  {file.path}
                </div>

              </div>

            </div>

            <div className="flex items-center gap-6">

              <div className="text-sm text-slate-400">
                {file.date}
              </div>

              {canDownloadFiles ? (
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-500
                  "
                >
                  <Download size={16} />
                  Baixar
                </button>
              ) : null}

            </div>

          </div>

        ))}

      </div>

      <div
        className="
          mt-8
          border-t
          border-slate-700
          pt-6
          text-right
        "
      >
        <button
          className="
            text-cyan-400
            font-semibold
            transition
            hover:text-cyan-300
          "
        >
          Abrir Telecomunicação →
        </button>
      </div>

    </section>
  );
}
