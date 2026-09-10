"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Users,
  Shield,
  Wrench,
  Headphones,
  PencilRuler,
  Trash2,
  Lock,
  Plus
} from "lucide-react";



import UserModal
from "@/components/admin/users/UserModal";

export default function UsersPage() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  async function loadUsers() {

    const token =
      localStorage.getItem("token");

    const res =
      await fetch(
        "https://api.geofibers.com.br/admin/users",
        {
          cache: "no-store",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    const data =
      await res.json();

    setUsers(
      Array.isArray(data)
        ? data.map((u:any) => ({
            ...u,
            company: u.Company,
            /*
             * ETAPA35A19B_PLATFORM_ACTION_PROTECTION
             *
             * Ignora roles internos de delegação.
             */
            role:
              u.UserRole?.find(
                (link: any) =>
                  link?.Role?.name &&
                  !String(
                    link.Role.name
                  ).startsWith(
                    "__DELEGATED_USER__:"
                  )
              )?.Role?.name ||
              "TECNICO"
          }))
        : []
    );
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function blockUser(id: string) {

    const token =
      localStorage.getItem("token");

    await fetch(
      `https://api.geofibers.com.br/admin/users/${id}/block`,
      {
        method: "PATCH",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    loadUsers();
  }

  async function unblockUser(id: string) {

    const token =
      localStorage.getItem("token");

    await fetch(
      `https://api.geofibers.com.br/admin/users/${id}/unblock`,
      {
        method: "PATCH",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    loadUsers();
  }

  async function deleteUser(id: string) {

    const ok =
      confirm(
        "Excluir usuário?"
      );

    if (!ok) return;

    const token =
      localStorage.getItem("token");

    await fetch(
      `https://api.geofibers.com.br/admin/users/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    loadUsers();
  }

  function roleBadge(role: string) {

    if (role === "ADMIN") {
      return "bg-cyan-500/20 text-cyan-300";
    }

    if (role === "ENGENHEIRO") {
      return "bg-blue-500/20 text-blue-300";
    }

    if (role === "TECNICO") {
      return "bg-yellow-500/20 text-yellow-300";
    }

    if (role === "PROJETISTA") {
      return "bg-purple-500/20 text-purple-300";
    }

    if (role === "AJUDANTE") {
      return "bg-green-500/20 text-green-300";
    }

    if (
      role === "ROOT" ||
      role === "MASTER"
    ) {
      return "bg-red-500/20 text-red-300";
    }

    return "bg-slate-700 text-slate-300";
  }

  function roleIcon(role: string) {

    if (role === "ADMIN") {
      return <Shield size={14} />;
    }

    if (role === "ENGENHEIRO") {
      return <Shield size={14} />;
    }

    if (role === "TECNICO") {
      return <Wrench size={14} />;
    }

    if (role === "PROJETISTA") {
      return <PencilRuler size={14} />;
    }

    if (role === "AJUDANTE") {
      return <Headphones size={14} />;
    }

    return <Users size={14} />;
  }

  return (

    

    <div
      className="
        p-3 lg:p-8 text-white
      "
    >

      <UserModal
        open={open}
        user={selectedUser}
        onClose={() => {

          setOpen(false);

          setSelectedUser(null);
        }}
        onSaved={loadUsers}
      />

      <div
        className="
          flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8
        "
      >

        <div>

          <h1
            className="
              text-2xl lg:text-4xl font-black
            "
          >
            Gestão de Usuários
          </h1>

          <p
            className="
              text-slate-500
              mt-2
            "
          >
            Administração enterprise multiempresa
          </p>

        </div>

        <button
          onClick={() => {

            setSelectedUser(null);

            setOpen(true);
          }}
          className="
            flex
            items-center
            gap-2
            bg-cyan-500
            hover:bg-cyan-400
            transition
            text-slate-950
            font-bold
            px-4 lg:px-5 py-2 lg:py-3 rounded-2xl text-sm lg:text-base
          "
        >

          <Plus size={18} />

          Novo Usuário

        </button>

      </div>

      <div
        className="
          lg:hidden
          flex
          flex-col
          gap-4
          mb-6
        "
      >

        {users.map((user) => (

          <div
            key={`mobile-${user.id}`}
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-4
            "
          >

            <div className="mb-3">

              <h3 className="font-bold text-white">
                {user.name}
              </h3>

              <p className="text-slate-400 text-sm">
                {user.company?.name || "Sem empresa"}
              </p>

            </div>

            <div className="space-y-2 text-sm">

              <p>
                <strong>E-mail:</strong> {user.email}
              </p>

              <p>
                <strong>WhatsApp:</strong> {user.whatsapp || "-"}
              </p>

            </div>

            <div className="mt-4">

              <div
                className={`
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-bold
                  ${roleBadge(user.role)}
                `}
              >

                {roleIcon(user.role)}

                {user.role}

              </div>

            </div>

            <div
              className="
                mt-4
                flex
                flex-col
                gap-2
              "
            >

              <button
                onClick={() => {
                  setSelectedUser(user);
                  setOpen(true);
                }}
                className="
                  w-full
                  px-3
                  py-3
                  rounded-xl
                  bg-cyan-500
                "
              >
                Editar
              </button>

              {!["ROOT","MASTER"].includes(user.role) && (

              <button
                onClick={() =>
                  user.isActive
                    ? blockUser(user.id)
                    : unblockUser(user.id)
                }
                className={`
                  w-full
                  px-3
                  py-3
                  rounded-xl
                  ${
                    user.isActive
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }
                `}
              >
                {user.isActive
                  ? "Bloquear"
                  : "Desbloquear"}
              </button>

              )}

              {!["ROOT","MASTER","ADMIN"].includes(user.role) && (

              <button
                onClick={() =>
                  deleteUser(user.id)
                }
                className="
                  w-full
                  px-3
                  py-3
                  rounded-xl
                  bg-red-600
                "
              >
                Excluir
              </button>

              )}

            </div>

          </div>

        ))}

      </div>


      <div
        className="
          hidden
          lg:block
          rounded-3xl
          border
          border-slate-800
          overflow-x-auto
        "
      >

        <table
          className="
            w-full min-w-[650px] text-sm
          "
        >

          <thead
            className="
              bg-slate-900
            "
          >

            <tr>

              <th className="p-4 text-left">
                Nome
              </th>

              <th className="p-4 text-left">
                Empresa
              </th>

              <th className="p-4 text-left">
                E-mail
              </th>

              <th className="p-4 text-left">
                WhatsApp
              </th>

              <th className="p-4 text-left">
                Categoria
              </th>

              <th className="p-4 text-left">
                Ações
              </th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr
                key={user.id}
                className="
                  border-t
                  border-slate-800
                "
              >

                <td className="p-2 lg:p-4">
                  {user.name}
                </td>

                <td className="p-2 lg:p-4">
                  {user.company?.name}
                </td>

                <td className="p-2 lg:p-4">
                  {user.email}
                </td>

                <td className="p-2 lg:p-4">
                  {user.whatsapp || "-"}
                </td>

                <td className="p-2 lg:p-4">

                  <div
                    className={`
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-bold
                      ${roleBadge(user.role)}
                    `}
                  >

                    {roleIcon(user.role)}

                    {user.role}

                  </div>

                </td>

                <td className="p-2 lg:p-4">

                  <div
                    className="
                      flex flex-col lg:flex-row gap-2
                    "
                  >

                    <button
                      onClick={() => {

                        setSelectedUser(user);

                        setOpen(true);
                      }}
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-cyan-500
                        hover:bg-cyan-400
                        transition
                      "
                    >
                      Editar
                    </button>

                    {!["ROOT","MASTER"].includes(user.role) && (

                    <button
                      onClick={() =>

                        user.isActive
                          ? blockUser(user.id)
                          : unblockUser(user.id)
                      }
                      className={`
                        px-3
                        py-2
                        rounded-xl
                        transition
                        ${
                          user.isActive
                            ? "bg-yellow-500 hover:bg-yellow-400"
                            : "bg-green-600 hover:bg-green-500"
                        }
                      `}
                    >

                      {user.isActive
                        ? "Bloquear"
                        : "Desbloquear"}

                    </button>

                    )}

                    {!["ROOT","MASTER","ADMIN"].includes(user.role) && (

                    <button
                      onClick={() =>
                        deleteUser(user.id)
                      }
                      className="
                        px-3
                        py-2
                        rounded-xl
                        bg-red-600
                        hover:bg-red-500
                        transition
                      "
                    >

                      <Trash2 size={16} />

                    </button>

                    )}

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

    

  );
}
