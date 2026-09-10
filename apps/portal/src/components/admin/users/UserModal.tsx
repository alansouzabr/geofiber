"use client";

import {
  useEffect,
  useState
} from "react";

interface Props {

  open: boolean;

  user?: any;

  onClose: () => void;

  onSaved: () => void;
}


/*
 * ETAPA35A19B_PLATFORM_USER_MODAL
 *
 * Cargos empresariais disponíveis para gestão ROOT/MASTER.
 *
 * ROOT e MASTER são papéis da plataforma e nunca entram
 * no seletor comum de cargos.
 *
 * ANALISTA é suportado pelo UsersService e pode ser
 * provisionado sob demanda pela API.
 *
 * USER permanece somente como compatibilidade legada.
 */
const COMPANY_ROLE_OPTIONS = [

  {
    value: "ADMIN",
    label: "Administrador"
  },

  {
    value: "ENGENHEIRO",
    label: "Engenheiro"
  },

  {
    value: "ANALISTA",
    label: "Analista"
  },

  {
    value: "SUPERVISOR",
    label: "Supervisor"
  },

  {
    value: "TECNICO",
    label: "Técnico"
  },

  {
    value: "AJUDANTE",
    label: "Ajudante"
  },

  {
    value: "PROJETISTA",
    label: "Projetista"
  },

  {
    value: "RH",
    label: "RH"
  },

  {
    value: "FINANCEIRO",
    label: "Financeiro"
  },

  {
    value: "COMERCIAL",
    label: "Comercial"
  },

  {
    value: "ATENDENTE",
    label: "Atendente"
  },

] as const;


const PLATFORM_ROLE_NAMES =
  new Set([
    "ROOT",
    "MASTER"
  ]);


export default function UserModal({
  open,
  user,
  onClose,
  onSaved
}: Props) {

  const normalizedUserRole =
    String(
      user?.role ||
      ""
    )
      .trim()
      .toUpperCase();


  const isPlatformUser =
    PLATFORM_ROLE_NAMES.has(
      normalizedUserRole
    );


  const isLegacyUserRole =
    normalizedUserRole ===
      "USER";


  const [companies, setCompanies] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      whatsapp: "",

      password: "",

      role: "ADMIN",

      companyId: ""
    });

  useEffect(() => {

    if (!open) return;

    const token =
      localStorage.getItem("token");

    fetch(
      "https://api.geofibers.com.br/admin/companies",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )
      .then(res => res.json())
      .then(data => {

        /*
         * Usuários empresariais nunca devem ser
         * vinculados à Company MASTER da plataforma.
         */
        setCompanies(
          Array.isArray(data)
            ? data.filter(
                (company: any) =>
                  company?.kind === "CLIENT"
              )
            : []
        );

      });

  }, [open]);

  useEffect(() => {

    if (!user) {

      setForm({

        name: "",

        email: "",

        whatsapp: "",

        password: "",

        role: "ADMIN",

        companyId: ""

      });

      return;

    }

    setForm({

      name:
        user.name || "",

      email:
        user.email || "",

      whatsapp:
        user.whatsapp || "",

      password: "",

      role:
        user.role || "ADMIN",

      companyId:
        user.companyId || ""
    });

  }, [user]);

  async function save() {

    const token =
      localStorage.getItem("token");

    const url =
      user
        ? `https://api.geofibers.com.br/admin/users/${user.id}`
        : "https://api.geofibers.com.br/admin/users";

    const method =
      user
        ? "PATCH"
        : "POST";

    /*
     * ROOT / MASTER podem ter nome, e-mail,
     * senha e WhatsApp atualizados.
     *
     * O frontend nunca envia role/companyId
     * para contas da plataforma.
     */
    const payload: any = {
      ...form
    };


    if (!payload.password) {
      delete payload.password;
    }


    if (isPlatformUser) {

      delete payload.role;
      delete payload.companyId;

    }


    /*
     * USER é um papel legado.
     *
     * Se o usuário já estiver nele e não houver
     * mudança explícita, não tentamos reprovisioná-lo.
     */
    if (
      isLegacyUserRole &&
      String(form.role).toUpperCase() ===
        "USER"
    ) {

      delete payload.role;

    }


    const res =
      await fetch(
        url,
        {
          method,

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify(payload)
        }
      );

    if (!res.ok) {

      alert(
        "Erro ao salvar usuário"
      );

      return;
    }

    alert(
      user
        ? "Usuário atualizado com sucesso"
        : "Usuário criado com sucesso"
    );

    onSaved();

    onClose();
  }

  if (!open) return null;

  return (

    <div
      className="
        fixed
        inset-0
        bg-black/70
        z-50
        flex
        items-center
        justify-center
      "
    >

      <div
        className="
          w-full
          max-w-2xl mx-3 lg:mx-auto
          rounded-3xl
          bg-slate-950
          border
          border-slate-800
          p-4 lg:p-8
        "
      >

        <h2
          className="
            text-xl lg:text-3xl
            font-black
            text-white
            mb-2
          "
        >
          {user
            ? "Editar Usuário"
            : "Novo Usuário"}
        </h2>

        <p
          className="
            text-slate-500
            mb-8
          "
        >
          Gestão enterprise multiempresa
        </p>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5
          "
        >

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              Usuário
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
              "
            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              WhatsApp
            </label>

            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Ex.: 5599999999999"
              value={form.whatsapp}
              onChange={(e) =>
                setForm({
                  ...form,
                  whatsapp: e.target.value
                })
              }
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
              "
            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              E-mail
            </label>

            <input
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
              "
            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              Senha
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value
                })
              }
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
              "
            />

          </div>

          {isPlatformUser && (

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              Empresa da Plataforma
            </label>

            <input
              value={
                user?.company?.name ||
                user?.Company?.name ||
                ""
              }
              readOnly
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
                text-slate-400
                cursor-not-allowed
              "
            />

          </div>

          )}


          {isPlatformUser && (

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              Cargo da Plataforma
            </label>

            <input
              value={normalizedUserRole}
              readOnly
              className="
                rounded-2xl
                bg-slate-900
                border
                border-red-900/60
                px-4
                py-3
                text-red-300
                font-bold
                cursor-not-allowed
              "
            />

            <span className="text-xs text-slate-500">
              Cargo protegido do sistema.
            </span>

          </div>

          )}


          {!isPlatformUser && (

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              Empresa
            </label>

            <select
              value={form.companyId}
              onChange={(e) =>
                setForm({
                  ...form,
                  companyId: e.target.value
                })
              }
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
              "
            >

              <option value="">
                Selecionar Empresa
              </option>

              {companies.map((c) => (

                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>

              ))}

            </select>

          </div>

          )}

          {!isPlatformUser && (

          <div className="flex flex-col gap-2">

            <label className="text-sm text-slate-300">
              Cargo
            </label>

            <select
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value
                })
              }
              className="
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                px-4
                py-3
              "
            >

              {isLegacyUserRole && (

                <option value="USER">
                  USER — Legado
                </option>

              )}


              {COMPANY_ROLE_OPTIONS.map(
                option => (

                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>

                )
              )}

            </select>

          </div>

          )}

        </div>

        <div
          className="
            flex flex-col lg:flex-row lg:justify-end gap-3
            mt-8
          "
        >

          <button
            onClick={onClose}
            className="
              px-5
              py-3
              rounded-2xl
              bg-slate-800
            "
          >
            Cancelar
          </button>

          <button
            onClick={save}
            className="
              px-5
              py-3
              rounded-2xl
              bg-cyan-500
              text-slate-950
              font-bold
            "
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}
