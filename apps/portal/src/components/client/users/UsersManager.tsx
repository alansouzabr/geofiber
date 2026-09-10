"use client";

import {
  useEffect,
  useState
} from "react";
import { getToken, getCurrentRole } from "@/lib/auth";
import { canCreateUsers, canEditUsers, canDeleteUsers } from "@/lib/rbac";

import UserEditModal
from "./UserEditModal";

import UserCreateModal
from "./UserCreateModal";

import {
  Plus,
  Pencil,
  Trash2,
  Lock
} from "lucide-react";

interface User {

  id: string;

  name: string;

  email: string;

  role: string;

  

  isActive?: boolean;

  whatsapp?: string;
}

export default function UsersManager() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [open, setOpen] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const currentRole =
    getCurrentRole();

  async function loadUsers() {

    try {

      const token =
        getToken();

      const res =
        await fetch(
          "https://api.geofibers.com.br/users",
          {
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
          ? data
          : []
      );

    } catch {

      setUsers([]);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);


  async function toggleUser(
    id: string
  ) {

    if(!canEditUsers(currentRole)){
      return;
    }

    const token =
      getToken();

    await fetch(

      `https://api.geofibers.com.br/users/${id}/toggle`,

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

  async function deleteUser(
    id: string
  ) {

    if(!canDeleteUsers(currentRole)){
      return;
    }

    const ok =
      confirm(
        "Excluir usuário?"
      );

    if (!ok) return;

    const token =
      getToken();

    await fetch(

      `https://api.geofibers.com.br/users/${id}`,

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


  
function badge(role?: string) {

  switch(role){

    case "ADMIN":
      return "bg-red-500/20 text-red-400";

    case "ENGENHEIRO":
      return "bg-indigo-500/20 text-indigo-400";

    case "ANALISTA":
      return "bg-blue-500/20 text-blue-400";

    case "SUPERVISOR":
      return "bg-orange-500/20 text-orange-400";

    case "TECNICO":
      return "bg-amber-500/20 text-amber-400";

    case "AJUDANTE":
      return "bg-emerald-500/20 text-emerald-400";

    case "PROJETISTA":
      return "bg-cyan-500/20 text-cyan-400";

    case "RH":
      return "bg-pink-500/20 text-pink-400";

    case "FINANCEIRO":
      return "bg-lime-500/20 text-lime-400";

    case "COMERCIAL":
      return "bg-violet-500/20 text-violet-400";

    case "ATENDENTE":
      return "bg-sky-500/20 text-sky-400";

    default:
      return "bg-slate-500/20 text-slate-300";
  }

}


  return (

    <div>

      <UserEditModal
        open={editOpen}
        user={selectedUser}
        onClose={() => setEditOpen(false)}
        onSaved={loadUsers}
      />

      <UserCreateModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={loadUsers}
      />

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-black
              text-white
            "
          >
            Usuários
          </h1>

          <p
            className="
              text-slate-500
              mt-2
            "
          >
            Gestão de acessos da empresa
          </p>

        </div>

        {canCreateUsers(currentRole) && (

        <button
          onClick={() => setOpen(true)}
          className="
            flex
            items-center
            gap-2
            bg-cyan-500
            hover:bg-cyan-400
            text-black
            px-5
            py-3
            rounded-xl
            font-semibold
            transition-all
          "
        >

          <Plus size={18} />

          Novo Usuário

        </button>

        )}

      </div>

      <div
        className="
          overflow-auto
          rounded-2xl
          border
          border-slate-800
        "
      >

        <table
          className="
            w-full
            text-sm
          "
        >

          <thead
            className="
              bg-slate-900
            "
          >

            <tr>

              <th className="text-left p-4">
                Nome
              </th>

              <th className="text-left p-4">
                E-mail
              </th>

              <th className="text-left p-4">
                Tipo
              </th>

              <th className="text-left p-4">
                WhatsApp
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
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

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold
                      ${badge(user.role)}
                    `}
                  >
                    {user.role || "TECNICO"}
                  </span>

                </td>

                <td className="p-4">
                  {user.whatsapp || "-"}
                </td>

                <td className="p-4">

                  <span
                    className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-semibold

                      ${
                        user.isActive
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {user.isActive
                      ? "ATIVO"
                      : "BLOQUEADO"}
                  </span>

                </td>

                <td className="p-4">

                  <div
                    className="
                      flex
                      gap-2
                    "
                  >

                    {canEditUsers(currentRole) && (

                    <button
                      onClick={() => {

                        if(!canEditUsers(currentRole)){
                          return;
                        }

                        setSelectedUser(user);
                        setEditOpen(true);

                      }}
                      className="
                        bg-cyan-500
                        hover:bg-cyan-400
                        text-white
                        p-2
                        rounded-lg
                      "
                    >
                      <Pencil size={16} />
                    </button>

                    )}

                    <button
                      onClick={() => toggleUser(user.id)}
                      className="
                        bg-amber-500
                        hover:bg-amber-400
                        text-white
                        p-2
                        rounded-lg
                      "
                    >
                      <Lock size={16} />
                    </button>

                    {canDeleteUsers(currentRole) && (

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="
                        bg-red-500
                        hover:bg-red-400
                        text-white
                        p-2
                        rounded-lg
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
