"use client";
import { USER_ROLES } from "@/constants/userRoles";

import {
  useEffect,
  useState
} from "react";

interface Props {

  open: boolean;

  user: any;

  onClose: () => void;

  onSaved: () => void;
}

export default function UserEditModal({
  open,
  user,
  onClose,
  onSaved
}: Props) {

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      whatsapp: "",

      role: "TECNICO"
    });

  useEffect(() => {

    if (user) {

      setForm({

        name:
          user.name || "",

        email:
          user.email || "",

        whatsapp:
          user.whatsapp || "",

        role:
          user.role || "TECNICO"
      });
    }

  }, [user]);

  if (!open || !user)
    return null;

  async function save() {

    const token =
      localStorage.getItem("token");

    await fetch(

      `https://api.geofibers.com.br/users/${user.id}`,

      {
        method: "PATCH",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`
        },

        body: JSON.stringify(form)
      }
    );

    onSaved();

    onClose();

    alert(
      "Usuário atualizado!"
    );
  }

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/70
        flex
        items-center
        justify-center
        z-50
      "
    >

      <div
        className="
          bg-slate-950
          border
          border-slate-800
          rounded-2xl
          p-8
          w-full
          max-w-xl
        "
      >

        <h2
          className="
            text-2xl
            font-black
            text-white
            mb-6
          "
        >
          Editar Usuário
        </h2>

        <div
          className="
            grid
            gap-4
          "
        >

          <input
            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }

            placeholder="Nome"

            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          <input
            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }

            placeholder="E-mail"

            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          <input
            value={form.whatsapp}

            onChange={(e) =>
              setForm({
                ...form,
                whatsapp: e.target.value
              })
            }

            placeholder="WhatsApp"

            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          
          <select

            value={form.role}

            onChange={(e)=>
              setForm({
                ...form,
                role:e.target.value
              })
            }

            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          >

            
{USER_ROLES.map(role=>(

  <option
    key={role}
    value={role}
  >
    {role}
  </option>

))}
          </select>



        </div>

        <div
          className="
            flex
            justify-end
            gap-3
            mt-8
          "
        >

          <button

            onClick={onClose}

            className="
              px-5
              py-3
              rounded-xl
              bg-slate-800
              text-white
            "
          >
            Cancelar
          </button>

          <button

            onClick={save}

            className="
              px-5
              py-3
              rounded-xl
              bg-cyan-500
              text-black
              font-semibold
            "
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}
