"use client";
import { USER_ROLES } from "@/constants/userRoles";

import {
  useState
} from "react";

interface Props {

  open: boolean;

  onClose: () => void;

  onSaved: () => void;
}

export default function UserCreateModal({
  open,
  onClose,
  onSaved
}: Props) {

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      whatsapp: "",

      password: "",

      role: "TECNICO"
    });

  if (!open) return null;

  async function submit() {

    const token =
      localStorage.getItem("token");

    await fetch(

      "https://api.geofibers.com.br/users",

      {
        method: "POST",

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
          Novo Usuário
        </h2>

        <div
          className="
            grid
            gap-4
          "
        >

          <input
            placeholder="Nome"

            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
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
          />

          <input
            placeholder="E-mail"

            value={form.email}

            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
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
          />

          <input
            placeholder="WhatsApp"

            value={form.whatsapp}

            onChange={(e) =>
              setForm({
                ...form,
                whatsapp: e.target.value
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
          />

          <input
            type="password"

            placeholder="Senha"

            value={form.password}

            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
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
          />

          <select

            value={form.role}

            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value
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

            onClick={submit}

            className="
              px-5
              py-3
              rounded-xl
              bg-cyan-500
              text-black
              font-semibold
            "
          >
            Criar Usuário
          </button>

        </div>

      </div>

    </div>
  );
}
