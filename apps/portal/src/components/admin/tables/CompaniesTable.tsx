"use client";

import {
  useState
} from "react";

import {
  Company
} from "../types/admin.types";

import CompanyEditModal
from "../modals/CompanyEditModal";

type Props = {
  companies: Company[];
  onActivate: (
    id: string
  ) => void;

  onDeactivate: (
    id: string
  ) => void;

  onDelete: (
    company: Company
  ) => void;
};

export default function CompaniesTable({
  companies,
  onActivate,
  onDeactivate,
  onDelete
}: Props) {

  const [editOpen, setEditOpen] =
    useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState<Company | null>(null);

  function openEdit(
    company: Company
  ) {

    setSelectedCompany(company);

    setEditOpen(true);
  }

  return (
    <>
      <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        overflow-x-auto
      "
    >

      <table className="w-full min-w-[700px]">

        <thead
          className="
            bg-slate-950
          "
        >

          <tr>

            <th className="p-4 text-left">
              Empresa
            </th>

            <th className="p-4 text-left">
              Plano
            </th>

            <th className="p-4 text-left">
              Usuários
            </th>

            <th className="p-4 text-left">
              Status
            </th>

            <th className="p-4 text-left">
              Ações
            </th>

          </tr>

        </thead>

        <tbody>

          {companies.map((company) => (

            <tr
              key={company.id}
              className="
                border-t
                border-slate-800
              "
            >

              <td className="p-4">
                {company.name}
              </td>

              <td className="p-4">
                {company.plan?.name ||
                  "Sem plano"}
              </td>

              <td className="p-4">
                {company.User?.length ?? company.users?.length ?? 0}
              </td>

              <td className="p-4">

                <span
                  className={
                    company.isActive
                      ? `
                        px-3
                        py-1
                        rounded-full
                        bg-green-500/20
                        text-green-400
                        text-xs
                        font-bold
                        border
                        border-green-500/30
                      `
                      : `
                        px-3
                        py-1
                        rounded-full
                        bg-yellow-500/20
                        text-yellow-400
                        text-xs
                        font-bold
                        border
                        border-yellow-500/30
                      `
                  }
                >
                  {company.isActive
                    ? "ATIVA"
                    : "PENDENTE"}
                </span>

              </td>

              <td className="p-4">

                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    gap-2
                  "
                >

                  {company.isActive ? (

                    <button
                      onClick={() =>
                        onDeactivate(
                          company.id
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-yellow-600
                      "
                    >
                      Bloquear
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        onActivate(
                          company.id
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-green-600
                      "
                    >
                      Liberar
                    </button>

                  )}

                  <button
                    onClick={() =>
                      openEdit(company)
                    }
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-cyan-600
                    "
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      onDelete(company)
                    }
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-red-700
                    "
                  >
                    Excluir
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    <CompanyEditModal
      open={editOpen}
      company={selectedCompany}
      onClose={() =>
        setEditOpen(false)
      }
      onSaved={() =>
        window.location.reload()
      }
    />

    </>
  );
}
