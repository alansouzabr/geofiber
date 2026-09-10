"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type PersonType =
  | ""
  | "PF"
  | "PJ";

type CompanyProfile = {
  id?: string;
  name?: string | null;
  razaoSocial?: string | null;
  cnpj?: string | null;

  personType?: PersonType | null;
  firstName?: string | null;
  lastName?: string | null;
  cpf?: string | null;

  country?: string | null;
  cep?: string | null;
  address?: string | null;
  addressNumber?: string | null;
  complement?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;

  responsavelTecnico?: string | null;
  registroProfissional?: string | null;

  kind?: string | null;
  status?: string | null;
  isActive?: boolean;

  plan?: {
    id?: string;
    name?: string;
  } | null;
};

type ProfileResponse = {
  success?: boolean;
  company?: CompanyProfile;
  canEdit?: boolean;
  message?: string;
};

type FormState = {
  personType: PersonType;

  name: string;
  razaoSocial: string;
  cnpj: string;

  firstName: string;
  lastName: string;
  cpf: string;

  country: string;
  cep: string;
  address: string;
  addressNumber: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  phone: string;
  email: string;

  responsavelTecnico: string;
  registroProfissional: string;
};

const EMPTY_FORM: FormState = {
  personType: "",

  name: "",
  razaoSocial: "",
  cnpj: "",

  firstName: "",
  lastName: "",
  cpf: "",

  country: "Brasil",
  cep: "",
  address: "",
  addressNumber: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  phone: "",
  email: "",

  responsavelTecnico: "",
  registroProfissional: "",
};

function text(
  value: unknown,
) {
  return String(
    value ?? "",
  );
}

function apiBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.geofibers.com.br"
  ).replace(
    /\/+$/,
    "",
  );
}

function authToken() {
  if (
    typeof window === "undefined"
  ) {
    return "";
  }

  return (
    localStorage.getItem(
      "token",
    ) || ""
  );
}

function endpoint(
  companyId?: string,
) {
  const base =
    `${apiBase()}/company-profile`;

  if (!companyId) {
    return base;
  }

  return (
    `${base}/` +
    encodeURIComponent(
      companyId,
    )
  );
}

function fromCompany(
  company?: CompanyProfile,
): FormState {

  const type: PersonType =
    company?.personType === "PF"
      ? "PF"
      : company?.personType === "PJ"
        ? "PJ"
        : "";

  return {
    personType:
      type,

    name:
      text(company?.name),

    razaoSocial:
      text(
        company?.razaoSocial,
      ),

    cnpj:
      text(company?.cnpj),

    firstName:
      text(
        company?.firstName,
      ),

    lastName:
      text(
        company?.lastName,
      ),

    cpf:
      text(company?.cpf),

    country:
      text(
        company?.country,
      ) || "Brasil",

    cep:
      text(company?.cep),

    address:
      text(
        company?.address,
      ),

    addressNumber:
      text(
        company?.addressNumber,
      ),

    complement:
      text(
        company?.complement,
      ),

    district:
      text(
        company?.district,
      ),

    city:
      text(company?.city),

    state:
      text(company?.state),

    phone:
      text(company?.phone),

    email:
      text(company?.email),

    responsavelTecnico:
      text(
        company?.responsavelTecnico,
      ),

    registroProfissional:
      text(
        company?.registroProfissional,
      ),
  };
}

function errorMessage(
  value: unknown,
) {

  if (
    value instanceof Error
  ) {
    return value.message;
  }

  return String(value);
}

export default function CompanyProfileEditor({
  companyId,
}: {
  companyId?: string;
}) {

  const [
    form,
    setForm,
  ] =
    useState<FormState>(
      EMPTY_FORM,
    );

  const [
    company,
    setCompany,
  ] =
    useState<CompanyProfile | null>(
      null,
    );

  const [
    canEdit,
    setCanEdit,
  ] =
    useState(false);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");


  async function load() {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          endpoint(companyId),
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${authToken()}`,
            },

            cache:
              "no-store",
          },
        );

      const payload:
        ProfileResponse =
          await response.json()
            .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          payload.message ||
          "Não foi possível carregar os dados da empresa.",
        );
      }

      const profile =
        payload.company || {};

      setCompany(
        profile,
      );

      setForm(
        fromCompany(
          profile,
        ),
      );

      setCanEdit(
        Boolean(
          payload.canEdit,
        ),
      );

    } catch (err) {

      setError(
        errorMessage(err),
      );

    } finally {

      setLoading(false);
    }
  }


  useEffect(() => {
    void load();
  }, [companyId]);


  function change(
    field: keyof FormState,
    value: string,
  ) {

    setForm(
      current => ({
        ...current,
        [field]: value,
      }),
    );

    setSuccess("");
  }


  async function save(
    event: FormEvent,
  ) {

    event.preventDefault();

    if (!canEdit) {
      return;
    }

    setError("");
    setSuccess("");


    if (
      form.personType !== "PF" &&
      form.personType !== "PJ"
    ) {
      setError(
        "Selecione Pessoa Física ou Pessoa Jurídica.",
      );
      return;
    }


    if (
      form.personType === "PF" &&
      (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.cpf.trim()
      )
    ) {
      setError(
        "Para Pessoa Física informe Nome, Sobrenome e CPF.",
      );
      return;
    }


    if (
      form.personType === "PJ" &&
      (
        !form.name.trim() ||
        !form.cnpj.trim()
      )
    ) {
      setError(
        "Para Pessoa Jurídica informe Nome da Empresa e CNPJ.",
      );
      return;
    }


    setSaving(true);

    try {

      const normalizedName =
        form.personType === "PF"
          ? `${form.firstName.trim()} ${form.lastName.trim()}`
              .trim()
          : form.name.trim();

      const payload = {
        personType:
          form.personType,

        name:
          normalizedName,

        razaoSocial:
          form.personType === "PJ"
            ? form.razaoSocial
            : "",

        cnpj:
          form.personType === "PJ"
            ? form.cnpj
            : "",

        firstName:
          form.personType === "PF"
            ? form.firstName
            : "",

        lastName:
          form.personType === "PF"
            ? form.lastName
            : "",

        cpf:
          form.personType === "PF"
            ? form.cpf
            : "",

        country:
          form.country,

        cep:
          form.cep,

        address:
          form.address,

        addressNumber:
          form.addressNumber,

        complement:
          form.complement,

        district:
          form.district,

        city:
          form.city,

        state:
          form.state,

        phone:
          form.phone,

        email:
          form.email,

        responsavelTecnico:
          form.responsavelTecnico,

        registroProfissional:
          form.registroProfissional,
      };

      const response =
        await fetch(
          endpoint(companyId),
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${authToken()}`,
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const result:
        ProfileResponse =
          await response.json()
            .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Não foi possível salvar os dados da empresa.",
        );
      }

      if (result.company) {

        setCompany(
          result.company,
        );

        setForm(
          fromCompany(
            result.company,
          ),
        );
      }

      setSuccess(
        "Dados da empresa atualizados com sucesso.",
      );

    } catch (err) {

      setError(
        errorMessage(err),
      );

    } finally {

      setSaving(false);
    }
  }


  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "text-xs font-semibold uppercase tracking-wider text-slate-400";


  if (loading) {

    return (
      <div className="rounded-3xl border border-slate-800 bg-[#081223] p-8 text-slate-400">
        Carregando dados da empresa...
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <section className="rounded-3xl border border-slate-800 bg-[#081223] p-6 sm:p-8">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="text-xs uppercase tracking-[0.2em] text-sky-400">
              Empresa
            </div>

            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Dados da Empresa
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Cadastro institucional da organização vinculada ao GeoFiber.
              Dados de usuários, login e senha são administrados separadamente.
            </p>

          </div>

          <div className="flex flex-wrap gap-2 text-xs">

            {company?.kind ? (
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300">
                {company.kind}
              </span>
            ) : null}

            {company?.status ? (
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300">
                {company.status}
              </span>
            ) : null}

            {company?.plan?.name ? (
              <span className="rounded-full border border-sky-900 bg-sky-950/50 px-3 py-2 text-sky-300">
                Plano: {company.plan.name}
              </span>
            ) : null}

          </div>

        </div>

      </section>


      {error ? (
        <div className="rounded-2xl border border-rose-900/70 bg-rose-950/40 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}


      {success ? (
        <div className="rounded-2xl border border-emerald-900/70 bg-emerald-950/40 p-4 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}


      {!canEdit ? (
        <div className="rounded-2xl border border-amber-900/70 bg-amber-950/30 p-4 text-sm text-amber-200">
          Seu perfil possui acesso somente para consulta dos dados da empresa.
        </div>
      ) : null}


      <form
        onSubmit={save}
        className="space-y-6"
      >

        <fieldset
          disabled={
            !canEdit ||
            saving
          }
          className="space-y-6"
        >

          <section className="rounded-3xl border border-slate-800 bg-[#081223] p-6 sm:p-8">

            <h2 className="text-lg font-bold text-white">
              Tipo de cadastro
            </h2>

            <div className="mt-6 max-w-md">

              <label className={labelClass}>
                Pessoa Física / Jurídica
              </label>

              <select
                value={form.personType}
                onChange={
                  event =>
                    change(
                      "personType",
                      event.target.value,
                    )
                }
                className={inputClass}
              >
                <option value="">
                  Selecione
                </option>

                <option value="PF">
                  Pessoa Física
                </option>

                <option value="PJ">
                  Pessoa Jurídica
                </option>
              </select>

            </div>

          </section>


          {form.personType === "PF" ? (

            <section className="rounded-3xl border border-slate-800 bg-[#081223] p-6 sm:p-8">

              <h2 className="text-lg font-bold text-white">
                Pessoa Física
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                <div>
                  <label className={labelClass}>
                    Nome *
                  </label>

                  <input
                    value={form.firstName}
                    onChange={
                      e =>
                        change(
                          "firstName",
                          e.target.value,
                        )
                    }
                    className={inputClass}
                    placeholder="Nome"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Sobrenome *
                  </label>

                  <input
                    value={form.lastName}
                    onChange={
                      e =>
                        change(
                          "lastName",
                          e.target.value,
                        )
                    }
                    className={inputClass}
                    placeholder="Sobrenome"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    CPF *
                  </label>

                  <input
                    value={form.cpf}
                    onChange={
                      e =>
                        change(
                          "cpf",
                          e.target.value,
                        )
                    }
                    className={inputClass}
                    placeholder="000.000.000-00"
                  />
                </div>

              </div>

            </section>

          ) : null}


          {form.personType === "PJ" ? (

            <section className="rounded-3xl border border-slate-800 bg-[#081223] p-6 sm:p-8">

              <h2 className="text-lg font-bold text-white">
                Pessoa Jurídica
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                <div>
                  <label className={labelClass}>
                    Nome da Empresa *
                  </label>

                  <input
                    value={form.name}
                    onChange={
                      e =>
                        change(
                          "name",
                          e.target.value,
                        )
                    }
                    className={inputClass}
                    placeholder="Nome fantasia"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Razão Social
                  </label>

                  <input
                    value={form.razaoSocial}
                    onChange={
                      e =>
                        change(
                          "razaoSocial",
                          e.target.value,
                        )
                    }
                    className={inputClass}
                    placeholder="Razão social"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    CNPJ *
                  </label>

                  <input
                    value={form.cnpj}
                    onChange={
                      e =>
                        change(
                          "cnpj",
                          e.target.value,
                        )
                    }
                    className={inputClass}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

              </div>

            </section>

          ) : null}


          <section className="rounded-3xl border border-slate-800 bg-[#081223] p-6 sm:p-8">

            <h2 className="text-lg font-bold text-white">
              Endereço e contato
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              <div>
                <label className={labelClass}>
                  País
                </label>

                <input
                  value={form.country}
                  onChange={
                    e =>
                      change(
                        "country",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  CEP
                </label>

                <input
                  value={form.cep}
                  onChange={
                    e =>
                      change(
                        "cep",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                  placeholder="00000-000"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Endereço
                </label>

                <input
                  value={form.address}
                  onChange={
                    e =>
                      change(
                        "address",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Número
                </label>

                <input
                  value={form.addressNumber}
                  onChange={
                    e =>
                      change(
                        "addressNumber",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Complemento
                </label>

                <input
                  value={form.complement}
                  onChange={
                    e =>
                      change(
                        "complement",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Bairro
                </label>

                <input
                  value={form.district}
                  onChange={
                    e =>
                      change(
                        "district",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Cidade
                </label>

                <input
                  value={form.city}
                  onChange={
                    e =>
                      change(
                        "city",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Estado
                </label>

                <input
                  value={form.state}
                  onChange={
                    e =>
                      change(
                        "state",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Telefone
                </label>

                <input
                  value={form.phone}
                  onChange={
                    e =>
                      change(
                        "phone",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className={labelClass}>
                  E-mail
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={
                    e =>
                      change(
                        "email",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

            </div>

          </section>


          <section className="rounded-3xl border border-slate-800 bg-[#081223] p-6 sm:p-8">

            <h2 className="text-lg font-bold text-white">
              Responsabilidade técnica
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className={labelClass}>
                  Responsável Técnico
                </label>

                <input
                  value={form.responsavelTecnico}
                  onChange={
                    e =>
                      change(
                        "responsavelTecnico",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  CREA / CFT / Registro
                </label>

                <input
                  value={form.registroProfissional}
                  onChange={
                    e =>
                      change(
                        "registroProfissional",
                        e.target.value,
                      )
                  }
                  className={inputClass}
                />
              </div>

            </div>

          </section>

        </fieldset>


        <div className="flex flex-wrap items-center gap-3">

          {canEdit ? (
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {
                saving
                  ? "Salvando..."
                  : "Salvar Dados da Empresa"
              }
            </button>
          ) : null}

          <button
            type="button"
            onClick={
              () => void load()
            }
            disabled={
              loading ||
              saving
            }
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-60"
          >
            Recarregar
          </button>

        </div>

      </form>

    </div>
  );
}
