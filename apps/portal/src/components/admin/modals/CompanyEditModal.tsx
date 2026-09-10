"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Company
} from "../types/admin.types";

import { updateCompany } from "../services/admin.service";

function formatCnpj(value: string) {

  return value

    .replace(/\D/g, '')

    .replace(/(\d{2})(\d)/, '$1.$2')

    .replace(/(\d{3})(\d)/, '$1.$2')

    .replace(/(\d{3})(\d)/, '$1/$2')

    .replace(/(\d{4})(\d)/, '$1-$2')

    .slice(0, 18);
}

function validateCnpj(cnpj: string) {

  const cleaned =
    cnpj.replace(/\D/g, '');

  return cleaned.length === 14;
}



type Props = {

  open: boolean;

  company: Company | null;

  onClose: () => void;

  onSaved: () => void;
};

export default function CompanyEditModal({

  open,
  company,
  onClose,
  onSaved

}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<any>({

      name: "",

      email: "",

      whatsapp: "",

      password: "",

      isActive: true,

      razaoSocial: "",

      cnpj: "",

      responsibleName: "",

      responsibleCpf: ""
    });

  
  useEffect(() => {

    if (!company) return;

    const users =
      Array.isArray(company.User)
        ? company.User
        : Array.isArray(company.users)
          ? company.users
          : [];

    const adminUser =
      users.find((user: any) => {
        const roles = Array.isArray(user.UserRole)
          ? user.UserRole
          : [];

        return roles.some(
          (item: any) =>
            item?.Role?.name === "ADMIN" ||
            item?.role?.name === "ADMIN" ||
            item?.role === "ADMIN"
        );
      }) ||
      users.find(
        (user: any) =>
          user?.role === "ADMIN"
      );

    setForm({

      name:
        company.name || "",

      razaoSocial:
        (company as any)
          ?.razaoSocial || "",

      cnpj:
        (company as any)
          ?.cnpj || "",

      email:
        adminUser?.email || "",

      whatsapp:
        adminUser?.whatsapp || "",

      password: "",

      isActive:
        company.isActive,

      userId:
        adminUser?.id,

      userName:
        adminUser?.name || ""
    });

  }, [company]);

  async function save() {

    if (!company) return;

    try {

      setLoading(true);

      console.log(
        "PATCH COMPANY",
        company.id,
        form
      );

      await updateCompany(
        company.id,
        form
      );

      alert(
        "Empresa atualizada"
      );

      onSaved();

      onClose();

    } catch (err: any) {

      alert(
        err.message
      );

    } finally {

      setLoading(false);
    }
  }

  if (!open || !company)
    return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          rounded-3xl
          bg-slate-950
          border
          border-slate-800
          p-8
          space-y-6
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            Editar Empresa
          </h2>

          <p
            className="
              text-slate-400
              text-sm
            "
          >
            Gestão enterprise da empresa
          </p>

        </div>

        <div
          className="
            grid
            md:grid-cols-2
            gap-4
          "
        >

          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              Empresa
            </label>

            <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            placeholder="Empresa"
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          </div>

          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              Responsável Técnico
            </label>

            <input
            value={form.razaoSocial}
            onChange={(e) =>
              setForm({
                ...form,
                razaoSocial:
                  e.target.value
              })
            }
            placeholder="Responsável Técnico"
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          </div>

          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              CNPJ
            </label>

            <input
            value={form.cnpj}
            onChange={(e) =>
              setForm({
                ...form,
                cnpj:
                  formatCnpj(
                    e.target.value
                  )
              })
            }
            placeholder="CNPJ"
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          </div>

          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              E-mail Administrativo
            </label>

            <input
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            placeholder="E-mail Administrativo"
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          </div>

          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              WhatsApp
            </label>

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
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          </div>

          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              Nova Senha
            </label>

            <input
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            placeholder="Nova senha"
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
            "
          />

          </div>


          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm text-slate-300">
              Status
            </label>

            <select
            value={
              form.isActive
                ? "active"
                : "inactive"
            }
            onChange={(e) =>
              setForm({
                ...form,
                isActive:
                  e.target.value ===
                  "active"
              })
            }
            className="
              w-full
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
            "
          >

            <option value="active">
              Ativa
            </option>

            <option value="inactive">
              Bloqueada
            </option>

          </select>

          </div>

        </div>

        <div
          className="
            flex
            justify-end
            gap-3
          "
        >

          <button
            onClick={onClose}
            className="
              px-5
              py-3
              rounded-xl
              bg-slate-800
            "
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={save}
            className="
              px-5
              py-3
              rounded-xl
              bg-cyan-500
              text-slate-950
              font-bold
            "
          >

            {loading
              ? "Salvando..."
              : "Salvar"}

          </button>

        </div>

      </div>

    </div>
  );
}
