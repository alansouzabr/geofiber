"use client";

/*
 * ETAPA32G_FERRAMENTAS
 *
 * Inventário operacional por técnico.
 *
 * Persistência:
 *
 * FieldTechnicianProfile.tools Json?
 *
 * Esta tela NÃO representa as ferramentas
 * internas do editor GIS.
 */

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";


type PlatformCompany = {

  id: string;

  name: string;

  isActive?: boolean;

};


type TechnicianUser = {

  id?: string;

  name?: string | null;

  email?: string | null;

  isActive?: boolean;

};


type ToolStatus =
  | "EM_USO"
  | "DISPONIVEL"
  | "MANUTENCAO"
  | "BAIXADO";


type ToolCondition =
  | "NOVO"
  | "BOM"
  | "REGULAR"
  | "RUIM";


type TechnicianTool = {

  id: string;

  name: string;

  category: string;

  brand?: string;

  model?: string;

  serialNumber?: string;

  assetTag?: string;

  status: ToolStatus;

  condition?: ToolCondition;

  notes?: string;

  createdAt?: string;

};


type Technician = {

  id: string;

  companyId?: string;

  userId: string;

  isActive?: boolean;

  tools?: unknown;

  User?: TechnicianUser | null;

};


const CATEGORY_OPTIONS = [

  "Fusão",

  "Medição",

  "Fibra Óptica",

  "Ferramenta Manual",

  "Ferramenta Elétrica",

  "Acesso / Escada",

  "EPI",

  "Outros",

];


const STATUS_OPTIONS:
Array<{
  value: ToolStatus;
  label: string;
}> = [

  {
    value: "EM_USO",
    label: "Em uso",
  },

  {
    value: "DISPONIVEL",
    label: "Disponível",
  },

  {
    value: "MANUTENCAO",
    label: "Manutenção",
  },

  {
    value: "BAIXADO",
    label: "Baixado",
  },

];


const CONDITION_OPTIONS:
Array<{
  value: ToolCondition;
  label: string;
}> = [

  {
    value: "NOVO",
    label: "Novo",
  },

  {
    value: "BOM",
    label: "Bom",
  },

  {
    value: "REGULAR",
    label: "Regular",
  },

  {
    value: "RUIM",
    label: "Ruim",
  },

];


function getApiUrl() {

  const apiUrl =
    process.env
      .NEXT_PUBLIC_API_URL;


  if (!apiUrl) {

    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada."
    );

  }


  return apiUrl;

}


async function authorizedFetch(
  endpoint: string,
  options: RequestInit = {}
) {

  const token =
    localStorage.getItem(
      "token"
    );


  if (!token) {

    throw new Error(
      "Sessão não encontrada."
    );

  }


  const response =
    await fetch(
      `${getApiUrl()}${endpoint}`,
      {

        ...options,

        cache:
          "no-store",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {}),

        },

      }
    );


  const raw =
    await response.text();


  let data: unknown =
    null;


  try {

    data =
      raw
        ? JSON.parse(raw)
        : null;

  } catch {

    data = raw;

  }


  if (!response.ok) {

    let message = "";


    if (
      data &&
      typeof data === "object" &&
      "message" in data
    ) {

      const value =
        (
          data as {
            message?: unknown;
          }
        ).message;


      if (Array.isArray(value)) {

        message =
          value
            .map(String)
            .join(", ");

      } else if (
        value !== undefined &&
        value !== null
      ) {

        message =
          String(value);

      }

    }


    throw new Error(
      message ||
      `API_${response.status}`
    );

  }


  return data;

}


function isToolStatus(
  value: unknown
): value is ToolStatus {

  return (
    value === "EM_USO" ||
    value === "DISPONIVEL" ||
    value === "MANUTENCAO" ||
    value === "BAIXADO"
  );

}


function isToolCondition(
  value: unknown
): value is ToolCondition {

  return (
    value === "NOVO" ||
    value === "BOM" ||
    value === "REGULAR" ||
    value === "RUIM"
  );

}


function normalizeTools(
  value: unknown
): TechnicianTool[] {

  if (!Array.isArray(value)) {

    return [];

  }


  const normalized:
    TechnicianTool[] = [];


  for (
    const item
    of value
  ) {

    if (
      !item ||
      typeof item !== "object"
    ) {

      continue;

    }


    const raw =
      item as
        Record<string, unknown>;


    const id =
      typeof raw.id === "string"
        ? raw.id
        : "";


    const name =
      typeof raw.name === "string"
        ? raw.name.trim()
        : "";


    if (
      !id ||
      !name
    ) {

      continue;

    }


    normalized.push({

      id,

      name,

      category:
        typeof raw.category === "string"
          ? raw.category
          : "Outros",

      brand:
        typeof raw.brand === "string"
          ? raw.brand
          : "",

      model:
        typeof raw.model === "string"
          ? raw.model
          : "",

      serialNumber:
        typeof raw.serialNumber === "string"
          ? raw.serialNumber
          : "",

      assetTag:
        typeof raw.assetTag === "string"
          ? raw.assetTag
          : "",

      status:
        isToolStatus(
          raw.status
        )
          ? raw.status
          : "EM_USO",

      condition:
        isToolCondition(
          raw.condition
        )
          ? raw.condition
          : "BOM",

      notes:
        typeof raw.notes === "string"
          ? raw.notes
          : "",

      createdAt:
        typeof raw.createdAt === "string"
          ? raw.createdAt
          : undefined,

    });

  }


  return normalized;

}


function createToolId() {

  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {

    return crypto.randomUUID();

  }


  return [
    "tool",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 10),
  ].join("-");

}


function statusLabel(
  value: ToolStatus
) {

  return (
    STATUS_OPTIONS.find(
      item =>
        item.value === value
    )?.label ||
    value
  );

}


function conditionLabel(
  value?: ToolCondition
) {

  if (!value) {
    return "—";
  }


  return (
    CONDITION_OPTIONS.find(
      item =>
        item.value === value
    )?.label ||
    value
  );

}


export type FerramentasViewProps = {
  tenantCompanyId?: string;
  tenantCompanyName?: string;
};


export function FerramentasView({
  tenantCompanyId,
  tenantCompanyName
}: FerramentasViewProps) {

  const tenantMode =
    Boolean(
      tenantCompanyId
    );


  const [
    companies,
    setCompanies,
  ] =
    useState<PlatformCompany[]>(
      []
    );


  const [
    selectedCompanyId,
    setSelectedCompanyId,
  ] =
    useState("");


  const [
    technicians,
    setTechnicians,
  ] =
    useState<Technician[]>(
      []
    );


  const [
    selectedTechnicianId,
    setSelectedTechnicianId,
  ] =
    useState("");


  const [
    loadingCompanies,
    setLoadingCompanies,
  ] =
    useState(true);


  const [
    loadingTechnicians,
    setLoadingTechnicians,
  ] =
    useState(false);


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


  const [
    name,
    setName,
  ] =
    useState("");


  const [
    category,
    setCategory,
  ] =
    useState(
      CATEGORY_OPTIONS[0]
    );


  const [
    brand,
    setBrand,
  ] =
    useState("");


  const [
    model,
    setModel,
  ] =
    useState("");


  const [
    serialNumber,
    setSerialNumber,
  ] =
    useState("");


  const [
    assetTag,
    setAssetTag,
  ] =
    useState("");


  const [
    status,
    setStatus,
  ] =
    useState<ToolStatus>(
      "EM_USO"
    );


  const [
    condition,
    setCondition,
  ] =
    useState<ToolCondition>(
      "BOM"
    );


  const [
    notes,
    setNotes,
  ] =
    useState("");


  const selectedCompany =
    useMemo(
      () =>
        companies.find(
          company =>
            company.id ===
            selectedCompanyId
        ) || null,
      [
        companies,
        selectedCompanyId,
      ]
    );


  const selectedTechnician =
    useMemo(
      () =>
        technicians.find(
          technician =>
            technician.id ===
            selectedTechnicianId
        ) || null,
      [
        technicians,
        selectedTechnicianId,
      ]
    );


  const selectedTools =
    useMemo(
      () =>
        normalizeTools(
          selectedTechnician?.tools
        ),
      [
        selectedTechnician,
      ]
    );


  const totalTools =
    useMemo(
      () =>
        technicians.reduce(
          (
            total,
            technician
          ) =>
            total +
            normalizeTools(
              technician.tools
            ).length,
          0
        ),
      [
        technicians,
      ]
    );


  const maintenanceTools =
    useMemo(
      () =>
        technicians.reduce(
          (
            total,
            technician
          ) =>
            total +
            normalizeTools(
              technician.tools
            ).filter(
              tool =>
                tool.status ===
                "MANUTENCAO"
            ).length,
          0
        ),
      [
        technicians,
      ]
    );


  async function loadCompanies() {

    try {

      setLoadingCompanies(
        true
      );

      setError("");


      if (tenantMode) {

        const id =
          String(
            tenantCompanyId ||
            ""
          );


        if (!id) {

          setCompanies([]);
          setSelectedCompanyId("");

          return;

        }


        const tenantCompany:
          PlatformCompany = {

            id,

            name:
              tenantCompanyName ||
              "Minha empresa",

            isActive:
              true,

          };


        setCompanies([
          tenantCompany
        ]);

        setSelectedCompanyId(
          id
        );

        return;

      }


      const data =
        await authorizedFetch(
          "/admin/companies"
        );


      const list =
        Array.isArray(data)
          ? (
              data as
                PlatformCompany[]
            )
          : [];


      setCompanies(
        list
      );


      setSelectedCompanyId(
        current => {

          if (
            current &&
            list.some(
              company =>
                company.id ===
                current
            )
          ) {

            return current;

          }


          const active =
            list.find(
              company =>
                company.isActive !==
                false
            );


          return (
            active?.id ||
            list[0]?.id ||
            ""
          );

        }
      );

    } catch (err) {

      console.error(
        "TOOLS COMPANIES ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar as empresas."
      );

    } finally {

      setLoadingCompanies(
        false
      );

    }

  }


  async function loadTechnicians(
    companyId: string
  ) {

    if (!companyId) {

      setTechnicians(
        []
      );

      setSelectedTechnicianId(
        ""
      );

      return;

    }


    try {

      setLoadingTechnicians(
        true
      );

      setError("");


      const data =
        await authorizedFetch(
          tenantMode
              ? "/field-technicians"
              : `/field-technicians/platform/company/${encodeURIComponent(
            companyId
          )}`
        );


      const list =
        Array.isArray(data)
          ? (
              data as
                Technician[]
            )
          : [];


      setTechnicians(
        list
      );


      setSelectedTechnicianId(
        current => {

          if (
            current &&
            list.some(
              technician =>
                technician.id ===
                current
            )
          ) {

            return current;

          }


          return (
            list[0]?.id ||
            ""
          );

        }
      );

    } catch (err) {

      console.error(
        "TOOLS TECHNICIANS ERROR:",
        err
      );


      setTechnicians(
        []
      );

      setSelectedTechnicianId(
        ""
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os técnicos."
      );

    } finally {

      setLoadingTechnicians(
        false
      );

    }

  }


  useEffect(
    () => {

      void loadCompanies();

    },
    [
      tenantMode,
      tenantCompanyId,
      tenantCompanyName,
    ]
  );


  useEffect(
    () => {

      setSuccess("");

      setError("");

      setSelectedTechnicianId(
        ""
      );


      if (!selectedCompanyId) {

        setTechnicians(
          []
        );

        return;

      }


      void loadTechnicians(
        selectedCompanyId
      );

    },
    [
      selectedCompanyId,
    ]
  );


  async function persistTools(
    tools: TechnicianTool[],
    message: string
  ) {

    if (
      !selectedCompanyId ||
      !selectedTechnician
    ) {

      setError(
        "Selecione uma empresa e um técnico."
      );

      return false;

    }


    try {

      setSaving(
        true
      );

      setError("");

      setSuccess("");


      const data =
        await authorizedFetch(
          tenantMode
              ? `/field-technicians/${encodeURIComponent(
                  selectedTechnician.id
                )}/tools`
              : `/field-technicians/platform/company/${encodeURIComponent(
            selectedCompanyId
          )}/${encodeURIComponent(
            selectedTechnician.id
          )}/tools`,
          {

            method:
              "PATCH",

            body:
              JSON.stringify({
                tools,
              }),

          }
        );


      if (
        data &&
        typeof data === "object"
      ) {

        const updated =
          data as Technician;


        setTechnicians(
          current =>
            current.map(
              technician =>
                technician.id ===
                selectedTechnician.id
                  ? updated
                  : technician
            )
        );

      } else {

        await loadTechnicians(
          selectedCompanyId
        );

      }


      setSuccess(
        message
      );


      return true;

    } catch (err) {

      console.error(
        "TOOLS SAVE ERROR:",
        err
      );


      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar as ferramentas."
      );


      return false;

    } finally {

      setSaving(
        false
      );

    }

  }


  function clearForm() {

    setName("");

    setCategory(
      CATEGORY_OPTIONS[0]
    );

    setBrand("");

    setModel("");

    setSerialNumber("");

    setAssetTag("");

    setStatus(
      "EM_USO"
    );

    setCondition(
      "BOM"
    );

    setNotes("");

  }


  async function addTool(
    event: FormEvent
  ) {

    event.preventDefault();


    const cleanName =
      name.trim();


    if (!cleanName) {

      setError(
        "Informe o nome da ferramenta."
      );

      return;

    }


    if (!selectedTechnician) {

      setError(
        "Selecione um técnico."
      );

      return;

    }


    const tool:
      TechnicianTool = {

        id:
          createToolId(),

        name:
          cleanName,

        category:
          category.trim() ||
          "Outros",

        brand:
          brand.trim(),

        model:
          model.trim(),

        serialNumber:
          serialNumber.trim(),

        assetTag:
          assetTag.trim(),

        status,

        condition,

        notes:
          notes.trim(),

        createdAt:
          new Date()
            .toISOString(),

      };


    const ok =
      await persistTools(
        [
          ...selectedTools,
          tool,
        ],
        "Ferramenta adicionada."
      );


    if (ok) {

      clearForm();

    }

  }


  async function removeTool(
    tool: TechnicianTool
  ) {

    if (
      !window.confirm(
        `Remover "${tool.name}" do inventário deste técnico?`
      )
    ) {

      return;

    }


    await persistTools(
      selectedTools.filter(
        item =>
          item.id !== tool.id
      ),
      "Ferramenta removida."
    );

  }


  async function changeToolStatus(
    tool: TechnicianTool,
    nextStatus: ToolStatus
  ) {

    await persistTools(
      selectedTools.map(
        item =>
          item.id === tool.id
            ? {
                ...item,
                status:
                  nextStatus,
              }
            : item
      ),
      "Status atualizado."
    );

  }


  return (

    <main
      className="
        space-y-6
      "
    >

      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >

          <div>

            <div
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-cyan-400
              "
            >
              Execução
            </div>


            <h1
              className="
                mt-2
                text-3xl
                font-black
                text-white
              "
            >
              Ferramentas
            </h1>


            <p
              className="
                mt-2
                max-w-3xl
                text-sm
                leading-6
                text-slate-400
              "
            >
              Controle o inventário operacional
              atribuído aos técnicos de campo.
              Este módulo é independente das
              ferramentas do editor GeoFiber Maps.
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              void loadCompanies()
            }
            disabled={
              loadingCompanies
            }
            className="
              rounded-xl
              border
              border-slate-700
              px-4
              py-2.5
              text-sm
              font-bold
              text-slate-200
              transition
              hover:border-cyan-500
              hover:text-cyan-300
              disabled:opacity-50
            "
          >
            {
              loadingCompanies
                ? "Atualizando..."
                : "Atualizar"
            }
          </button>

        </div>

      </section>


      <section
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-5
          lg:p-8
        "
      >

        <div
          className="
            grid
            gap-4
            xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(170px,1fr))]
          "
        >

          <div>

            <div
              className="
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-slate-500
              "
            >
              Empresa
            </div>


            <select
              value={
                selectedCompanyId
              }
              onChange={
                event =>
                  setSelectedCompanyId(
                    event.target.value
                  )
              }
              disabled={
                tenantMode ||
                loadingCompanies ||
                companies.length === 0
              }
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-sm
                font-bold
                text-white
                outline-none
                focus:border-cyan-500
                disabled:opacity-50
              "
            >

              {
                companies.length ===
                0
                  ? (
                    <option value="">
                      Nenhuma empresa
                    </option>
                  )
                  : companies.map(
                      company => (

                        <option
                          key={
                            company.id
                          }
                          value={
                            company.id
                          }
                        >
                          {company.name}
                          {
                            company.isActive ===
                            false
                              ? " — INATIVA"
                              : ""
                          }
                        </option>

                      )
                    )
              }

            </select>


            <div
              className="
                mt-2
                text-xs
                text-slate-600
              "
            >
              {
                selectedCompany
                  ?.name ||
                "Empresa não selecionada"
              }
            </div>

          </div>


          <StatCard
            label="Técnicos"
            value={
              technicians.length
            }
          />


          <StatCard
            label="Ferramentas"
            value={
              totalTools
            }
          />


          <StatCard
            label="Manutenção"
            value={
              maintenanceTools
            }
          />

        </div>

      </section>


      {
        error
          ? (
            <div
              className="
                rounded-2xl
                border
                border-red-900/50
                bg-red-950/30
                p-4
                text-sm
                text-red-300
              "
            >
              {error}
            </div>
          )
          : null
      }


      {
        success
          ? (
            <div
              className="
                rounded-2xl
                border
                border-emerald-900/50
                bg-emerald-950/30
                p-4
                text-sm
                text-emerald-300
              "
            >
              {success}
            </div>
          )
          : null
      }


      <section
        className="
          grid
          gap-6
          xl:grid-cols-[340px_minmax(0,1fr)]
        "
      >

        <aside
          className="
            rounded-3xl
            border
            border-slate-800
            bg-[#081223]
            p-5
          "
        >

          <div
            className="
              mb-4
            "
          >

            <h2
              className="
                text-lg
                font-black
                text-white
              "
            >
              Técnicos
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              Selecione quem receberá
              ou possui ferramentas.
            </p>

          </div>


          {
            loadingTechnicians
              ? (
                <div
                  className="
                    py-8
                    text-center
                    text-sm
                    text-cyan-400
                  "
                >
                  Carregando...
                </div>
              )
              : technicians.length === 0
                ? (
                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      border-slate-700
                      p-6
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >
                    Nenhum técnico cadastrado
                    para esta empresa.
                  </div>
                )
                : (
                  <div
                    className="
                      space-y-2
                    "
                  >

                    {
                      technicians.map(
                        technician => {

                          const count =
                            normalizeTools(
                              technician.tools
                            ).length;


                          const active =
                            technician.id ===
                            selectedTechnicianId;


                          return (

                            <button
                              key={
                                technician.id
                              }
                              type="button"
                              onClick={() => {

                                setSelectedTechnicianId(
                                  technician.id
                                );

                                setError("");

                                setSuccess("");

                              }}
                              className={`
                                w-full
                                rounded-2xl
                                border
                                p-4
                                text-left
                                transition
                                ${
                                  active
                                    ? "border-cyan-500 bg-cyan-500/10"
                                    : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                                }
                              `}
                            >

                              <div
                                className="
                                  truncate
                                  font-black
                                  text-white
                                "
                              >
                                {
                                  technician
                                    .User
                                    ?.name ||
                                  "Técnico"
                                }
                              </div>


                              <div
                                className="
                                  mt-1
                                  truncate
                                  text-xs
                                  text-slate-500
                                "
                              >
                                {
                                  technician
                                    .User
                                    ?.email ||
                                  "Sem e-mail"
                                }
                              </div>


                              <div
                                className="
                                  mt-3
                                  text-xs
                                  font-bold
                                  text-cyan-400
                                "
                              >
                                {count}{" "}
                                {
                                  count === 1
                                    ? "ferramenta"
                                    : "ferramentas"
                                }
                              </div>

                            </button>

                          );

                        }
                      )
                    }

                  </div>
                )
          }

        </aside>


        <div
          className="
            space-y-6
          "
        >

          <section
            className="
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
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <div
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  Técnico selecionado
                </div>


                <h2
                  className="
                    mt-1
                    text-xl
                    font-black
                    text-white
                  "
                >
                  {
                    selectedTechnician
                      ?.User
                      ?.name ||
                    "Nenhum técnico selecionado"
                  }
                </h2>

              </div>


              {
                selectedTechnician
                  ? (
                    <span
                      className="
                        rounded-full
                        bg-cyan-500/10
                        px-3
                        py-1.5
                        text-xs
                        font-black
                        text-cyan-300
                      "
                    >
                      {
                        selectedTools.length
                      }{" "}
                      itens
                    </span>
                  )
                  : null
              }

            </div>

          </section>


          {
            selectedTechnician
              ? (
                <>
                  <section
                    className="
                      rounded-3xl
                      border
                      border-slate-800
                      bg-[#081223]
                      p-5
                      lg:p-7
                    "
                  >

                    <h2
                      className="
                        text-xl
                        font-black
                        text-white
                      "
                    >
                      Adicionar Ferramenta
                    </h2>


                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      Cadastre equipamentos
                      e ferramentas atribuídos
                      ao técnico.
                    </p>


                    <form
                      onSubmit={
                        addTool
                      }
                      className="
                        mt-6
                        grid
                        gap-4
                        lg:grid-cols-2
                      "
                    >

                      <Field
                        label="Ferramenta *"
                      >
                        <input
                          value={
                            name
                          }
                          onChange={
                            event =>
                              setName(
                                event
                                  .target
                                  .value
                              )
                          }
                          placeholder="Ex.: Máquina de fusão"
                          className={
                            inputClass
                          }
                        />
                      </Field>


                      <Field
                        label="Categoria"
                      >
                        <select
                          value={
                            category
                          }
                          onChange={
                            event =>
                              setCategory(
                                event
                                  .target
                                  .value
                              )
                          }
                          className={
                            inputClass
                          }
                        >
                          {
                            CATEGORY_OPTIONS.map(
                              item => (
                                <option
                                  key={
                                    item
                                  }
                                  value={
                                    item
                                  }
                                >
                                  {item}
                                </option>
                              )
                            )
                          }
                        </select>
                      </Field>


                      <Field
                        label="Marca"
                      >
                        <input
                          value={
                            brand
                          }
                          onChange={
                            event =>
                              setBrand(
                                event
                                  .target
                                  .value
                              )
                          }
                          placeholder="Ex.: Fujikura"
                          className={
                            inputClass
                          }
                        />
                      </Field>


                      <Field
                        label="Modelo"
                      >
                        <input
                          value={
                            model
                          }
                          onChange={
                            event =>
                              setModel(
                                event
                                  .target
                                  .value
                              )
                          }
                          placeholder="Ex.: 90S+"
                          className={
                            inputClass
                          }
                        />
                      </Field>


                      <Field
                        label="Número de série"
                      >
                        <input
                          value={
                            serialNumber
                          }
                          onChange={
                            event =>
                              setSerialNumber(
                                event
                                  .target
                                  .value
                              )
                          }
                          className={
                            inputClass
                          }
                        />
                      </Field>


                      <Field
                        label="Patrimônio"
                      >
                        <input
                          value={
                            assetTag
                          }
                          onChange={
                            event =>
                              setAssetTag(
                                event
                                  .target
                                  .value
                              )
                          }
                          placeholder="Ex.: GF-00125"
                          className={
                            inputClass
                          }
                        />
                      </Field>


                      <Field
                        label="Status"
                      >
                        <select
                          value={
                            status
                          }
                          onChange={
                            event =>
                              setStatus(
                                event.target.value as ToolStatus
                              )
                          }
                          className={
                            inputClass
                          }
                        >
                          {
                            STATUS_OPTIONS.map(
                              item => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {item.label}
                                </option>
                              )
                            )
                          }
                        </select>
                      </Field>


                      <Field
                        label="Condição"
                      >
                        <select
                          value={
                            condition
                          }
                          onChange={
                            event =>
                              setCondition(
                                event.target.value as ToolCondition
                              )
                          }
                          className={
                            inputClass
                          }
                        >
                          {
                            CONDITION_OPTIONS.map(
                              item => (
                                <option
                                  key={
                                    item.value
                                  }
                                  value={
                                    item.value
                                  }
                                >
                                  {item.label}
                                </option>
                              )
                            )
                          }
                        </select>
                      </Field>


                      <div
                        className="
                          lg:col-span-2
                        "
                      >
                        <Field
                          label="Observações"
                        >
                          <textarea
                            value={
                              notes
                            }
                            onChange={
                              event =>
                                setNotes(
                                  event
                                    .target
                                    .value
                                )
                            }
                            rows={3}
                            className={
                              inputClass
                            }
                          />
                        </Field>
                      </div>


                      <div
                        className="
                          flex
                          justify-end
                          lg:col-span-2
                        "
                      >

                        <button
                          type="submit"
                          disabled={
                            saving
                          }
                          className="
                            rounded-xl
                            bg-cyan-500
                            px-5
                            py-3
                            text-sm
                            font-black
                            text-slate-950
                            transition
                            hover:bg-cyan-400
                            disabled:opacity-50
                          "
                        >
                          {
                            saving
                              ? "Salvando..."
                              : "Adicionar Ferramenta"
                          }
                        </button>

                      </div>

                    </form>

                  </section>


                  <section
                    className="
                      rounded-3xl
                      border
                      border-slate-800
                      bg-[#081223]
                      p-5
                      lg:p-7
                    "
                  >

                    <div>

                      <h2
                        className="
                          text-xl
                          font-black
                          text-white
                        "
                      >
                        Inventário do Técnico
                      </h2>


                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        Ferramentas atualmente
                        vinculadas a este perfil.
                      </p>

                    </div>


                    {
                      selectedTools.length ===
                      0
                        ? (
                          <div
                            className="
                              mt-6
                              rounded-2xl
                              border
                              border-dashed
                              border-slate-700
                              p-8
                              text-center
                              text-sm
                              text-slate-500
                            "
                          >
                            Nenhuma ferramenta
                            cadastrada.
                          </div>
                        )
                        : (
                          <div
                            className="
                              mt-6
                              grid
                              gap-4
                              2xl:grid-cols-2
                            "
                          >

                            {
                              selectedTools.map(
                                tool => (

                                  <article
                                    key={
                                      tool.id
                                    }
                                    className="
                                      rounded-2xl
                                      border
                                      border-slate-800
                                      bg-slate-950/40
                                      p-5
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

                                      <div
                                        className="
                                          min-w-0
                                        "
                                      >

                                        <div
                                          className="
                                            truncate
                                            text-lg
                                            font-black
                                            text-white
                                          "
                                        >
                                          {
                                            tool.name
                                          }
                                        </div>


                                        <div
                                          className="
                                            mt-1
                                            text-xs
                                            font-bold
                                            text-cyan-400
                                          "
                                        >
                                          {
                                            tool.category
                                          }
                                        </div>

                                      </div>


                                      <span
                                        className="
                                          shrink-0
                                          rounded-full
                                          bg-slate-800
                                          px-2.5
                                          py-1
                                          text-[10px]
                                          font-black
                                          text-slate-300
                                        "
                                      >
                                        {
                                          statusLabel(
                                            tool.status
                                          )
                                        }
                                      </span>

                                    </div>


                                    <div
                                      className="
                                        mt-5
                                        grid
                                        gap-3
                                        text-sm
                                        sm:grid-cols-2
                                      "
                                    >

                                      <Value
                                        label="Marca"
                                        value={
                                          tool.brand
                                        }
                                      />

                                      <Value
                                        label="Modelo"
                                        value={
                                          tool.model
                                        }
                                      />

                                      <Value
                                        label="Série"
                                        value={
                                          tool.serialNumber
                                        }
                                      />

                                      <Value
                                        label="Patrimônio"
                                        value={
                                          tool.assetTag
                                        }
                                      />

                                      <Value
                                        label="Condição"
                                        value={
                                          conditionLabel(
                                            tool.condition
                                          )
                                        }
                                      />

                                    </div>


                                    {
                                      tool.notes
                                        ? (
                                          <div
                                            className="
                                              mt-4
                                              rounded-xl
                                              border
                                              border-slate-800
                                              bg-slate-950/60
                                              p-3
                                              text-xs
                                              leading-5
                                              text-slate-400
                                            "
                                          >
                                            {tool.notes}
                                          </div>
                                        )
                                        : null
                                    }


                                    <div
                                      className="
                                        mt-5
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                      "
                                    >

                                      <select
                                        value={
                                          tool.status
                                        }
                                        onChange={
                                          event =>
                                            void changeToolStatus(
                                              tool,
                                              event.target.value as ToolStatus
                                            )
                                        }
                                        disabled={
                                          saving
                                        }
                                        className="
                                          rounded-xl
                                          border
                                          border-slate-700
                                          bg-slate-950
                                          px-3
                                          py-2
                                          text-xs
                                          font-bold
                                          text-slate-200
                                          outline-none
                                          focus:border-cyan-500
                                          disabled:opacity-50
                                        "
                                      >
                                        {
                                          STATUS_OPTIONS.map(
                                            item => (
                                              <option
                                                key={
                                                  item.value
                                                }
                                                value={
                                                  item.value
                                                }
                                              >
                                                {item.label}
                                              </option>
                                            )
                                          )
                                        }
                                      </select>


                                      <button
                                        type="button"
                                        disabled={
                                          saving
                                        }
                                        onClick={() =>
                                          void removeTool(
                                            tool
                                          )
                                        }
                                        className="
                                          rounded-xl
                                          border
                                          border-red-900/50
                                          px-3
                                          py-2
                                          text-xs
                                          font-bold
                                          text-red-300
                                          transition
                                          hover:bg-red-950/30
                                          disabled:opacity-50
                                        "
                                      >
                                        Remover
                                      </button>

                                    </div>

                                  </article>

                                )
                              )
                            }

                          </div>
                        )
                    }

                  </section>
                </>
              )
              : (
                <section
                  className="
                    rounded-3xl
                    border
                    border-dashed
                    border-slate-700
                    bg-[#081223]
                    p-10
                    text-center
                  "
                >

                  <div
                    className="
                      text-lg
                      font-black
                      text-white
                    "
                  >
                    Selecione um técnico
                  </div>


                  <div
                    className="
                      mt-2
                      text-sm
                      text-slate-500
                    "
                  >
                    O inventário é vinculado
                    ao perfil técnico.
                  </div>

                </section>
              )
          }

        </div>

      </section>

    </main>

  );

}


const inputClass = `
  mt-2
  w-full
  rounded-xl
  border
  border-slate-700
  bg-slate-950
  px-4
  py-3
  text-sm
  text-white
  outline-none
  transition
  focus:border-cyan-500
`;


function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {

  return (

    <label
      className="
        block
      "
    >

      <span
        className="
          text-xs
          font-bold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </span>

      {children}

    </label>

  );

}


function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-950/50
        p-4
      "
    >

      <div
        className="
          text-xs
          font-bold
          uppercase
          tracking-wide
          text-slate-500
        "
      >
        {label}
      </div>


      <div
        className="
          mt-2
          text-3xl
          font-black
          text-white
        "
      >
        {value}
      </div>

    </div>

  );

}


function Value({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {

  return (

    <div>

      <span
        className="
          text-slate-600
        "
      >
        {label}:
      </span>{" "}

      <span
        className="
          text-slate-300
        "
      >
        {value || "—"}
      </span>

    </div>

  );

}


export default function FerramentasPage() {

  return (
    <FerramentasView />
  );

}
