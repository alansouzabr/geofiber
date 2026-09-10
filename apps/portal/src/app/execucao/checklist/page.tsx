"use client";

/*
 * ETAPA32I2C1_CHECKLIST_FRONTEND
 *
 * MASTER / ROOT:
 *
 * gerenciamento cross-company de
 * ChecklistTemplate e inspeção de
 * ChecklistExecution.
 *
 * As mutações de Execution permanecem
 * nos endpoints tenant nesta etapa.
 */

import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  AuthContext,
} from "@/context/AuthContext";


type ChecklistItemType =
  | "BOOLEAN"
  | "TEXT"
  | "NUMBER"
  | "SELECT"
  | "MULTISELECT";


type ChecklistExecutionStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";


type PlatformCompany = {
  id: string;
  name: string;
  isActive?: boolean;
  status?: string | null;
};


type ChecklistTemplateItem = {
  id?: string;
  templateId?: string;
  sortOrder?: number;
  label: string;
  description?: string | null;
  type: ChecklistItemType;
  required?: boolean;
  options?: unknown;
};


type ChecklistTemplate = {
  id: string;
  companyId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdByUserId?: string | null;
  Items?: ChecklistTemplateItem[];

  _count?: {
    Executions?: number;
  };
};


type ExecutionItem = {
  id: string;
  executionId?: string;
  templateItemId?: string | null;
  sortOrderSnapshot?: number;
  labelSnapshot: string;
  typeSnapshot: ChecklistItemType;
  requiredSnapshot?: boolean;
  optionsSnapshot?: unknown;
  response?: unknown;
  observation?: string | null;
  completedAt?: string | null;
};


type ChecklistExecution = {
  id: string;
  companyId: string;
  templateId: string;
  technicianProfileId?: string | null;
  startedByUserId?: string | null;
  status: ChecklistExecutionStatus;
  startedAt?: string;
  completedAt?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;

  Template?: {
    id?: string;
    name?: string | null;
  } | null;

  TechnicianProfile?: {
    id?: string;
    User?: {
      name?: string | null;
      email?: string | null;
    } | null;
  } | null;

  StartedBy?: {
    name?: string | null;
    email?: string | null;
  } | null;

  Items?: ExecutionItem[];
};


type DraftItem = {
  clientId: string;
  label: string;
  description: string;
  type: ChecklistItemType;
  required: boolean;
  optionsText: string;
};


type TemplateForm = {
  name: string;
  description: string;
  category: string;
  items: DraftItem[];
};


const TYPE_OPTIONS:
Array<{
  value: ChecklistItemType;
  label: string;
}> = [
  {
    value: "BOOLEAN",
    label: "Sim / Não",
  },
  {
    value: "TEXT",
    label: "Texto",
  },
  {
    value: "NUMBER",
    label: "Número",
  },
  {
    value: "SELECT",
    label: "Seleção única",
  },
  {
    value: "MULTISELECT",
    label: "Seleção múltipla",
  },
];


const STATUS_LABELS:
Record<
  ChecklistExecutionStatus,
  string
> = {
  DRAFT: "Rascunho",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};


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
  placeholder:text-slate-600
  focus:border-cyan-500
`;


function getApiUrl() {

  const value =
    process.env
      .NEXT_PUBLIC_API_URL;


  if (!value) {

    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada."
    );

  }


  return value;

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

    data =
      raw;

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


function createClientId() {

  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {

    return crypto.randomUUID();

  }


  return [
    "checklist-item",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 10),
  ].join("-");

}


function createEmptyItem():
DraftItem {

  return {
    clientId:
      createClientId(),

    label:
      "",

    description:
      "",

    type:
      "BOOLEAN",

    required:
      false,

    optionsText:
      "",
  };

}


function createEmptyForm():
TemplateForm {

  return {
    name:
      "",

    description:
      "",

    category:
      "",

    items: [
      createEmptyItem(),
    ],
  };

}


function isChoiceType(
  type: ChecklistItemType
) {

  return (
    type === "SELECT" ||
    type === "MULTISELECT"
  );

}


function parseOptions(
  value: string
) {

  return Array.from(
    new Set(
      value
        .split(/\r?\n/)
        .map(
          item =>
            item.trim()
        )
        .filter(Boolean)
    )
  );

}


function optionsToText(
  value: unknown
) {

  if (!Array.isArray(value)) {

    return "";

  }


  return value
    .map(String)
    .join("\n");

}


function formatDate(
  value?: string | null
) {

  if (!value) {

    return "—";

  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }


  return date.toLocaleString(
    "pt-BR"
  );

}


function formatValue(
  value: unknown
) {

  if (
    value === undefined ||
    value === null
  ) {

    return "—";

  }


  if (
    typeof value === "string"
  ) {

    return value || "—";

  }


  if (
    typeof value === "boolean"
  ) {

    return value
      ? "Sim"
      : "Não";

  }


  if (
    typeof value === "number"
  ) {

    return String(value);

  }


  try {

    return JSON.stringify(
      value
    );

  } catch {

    return String(value);

  }

}


function getErrorMessage(
  error: unknown,
  fallback: string
) {

  return error instanceof Error
    ? error.message
    : fallback;

}


export default function ChecklistExecutionPage() {

  /*
   * ETAPA32J3A_DUAL_MODE
   *
   * ROOT / MASTER:
   *   endpoints platform + seletor de empresa.
   *
   * Usuários tenant:
   *   empresa da sessão + endpoints tenant.
   */

  const auth =
    useContext(
      AuthContext
    );


  const user =
    auth?.user ??
    null;


  const authLoading =
    auth?.loading ??
    true;


  const role =
    String(
      user?.role ||
      ""
    );


  const isPlatformRole =
    role === "ROOT" ||
    role === "MASTER";


  const tenantUser =
    user as
      | {
          companyId?: string | null;
          companyName?: string | null;
          company?: {
            name?: string | null;
          } | null;
        }
      | null;


  const tenantCompanyId =
    String(
      tenantUser?.companyId ||
      ""
    );


  const tenantCompanyName =
    String(
      tenantUser?.companyName ||
      tenantUser?.company?.name ||
      "Minha empresa"
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
    templates,
    setTemplates,
  ] =
    useState<ChecklistTemplate[]>(
      []
    );


  const [
    executions,
    setExecutions,
  ] =
    useState<ChecklistExecution[]>(
      []
    );


  const [
    selectedExecutionId,
    setSelectedExecutionId,
  ] =
    useState("");


  const [
    executionDetail,
    setExecutionDetail,
  ] =
    useState<ChecklistExecution | null>(
      null
    );


  const [
    editingTemplateId,
    setEditingTemplateId,
  ] =
    useState<string | null>(
      null
    );


  const [
    form,
    setForm,
  ] =
    useState<TemplateForm>(
      createEmptyForm
    );


  const [
    loadingCompanies,
    setLoadingCompanies,
  ] =
    useState(true);


  const [
    loadingData,
    setLoadingData,
  ] =
    useState(false);


  const [
    loadingExecution,
    setLoadingExecution,
  ] =
    useState(false);


  const [
    savingTemplate,
    setSavingTemplate,
  ] =
    useState(false);


  const [
    actionTemplateId,
    setActionTemplateId,
  ] =
    useState("");


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


  const activeTemplates =
    useMemo(
      () =>
        templates.filter(
          template =>
            template.isActive !==
            false
        ).length,
      [
        templates,
      ]
    );


  const executionStats =
    useMemo(
      () => {

        const stats = {
          DRAFT: 0,
          IN_PROGRESS: 0,
          COMPLETED: 0,
          CANCELLED: 0,
        };


        for (
          const execution
          of executions
        ) {

          if (
            execution.status
            in stats
          ) {

            stats[
              execution.status
            ] += 1;

          }

        }


        return stats;

      },
      [
        executions,
      ]
    );


  async function loadCompanies() {

    try {

      setLoadingCompanies(
        true
      );

      setError("");


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
        "CHECKLIST COMPANIES ERROR:",
        err
      );


      setCompanies(
        []
      );


      setSelectedCompanyId(
        ""
      );


      setError(
        getErrorMessage(
          err,
          "Não foi possível carregar as empresas."
        )
      );

    } finally {

      setLoadingCompanies(
        false
      );

    }

  }


  function templatesBaseUrl(
    companyId: string
  ) {

    if (isPlatformRole) {

      return (
        `/checklists/platform/company/${encodeURIComponent(
          companyId
        )}/templates`
      );

    }


    return "/checklists/templates";

  }


  function executionsBaseUrl(
    companyId: string
  ) {

    if (isPlatformRole) {

      return (
        `/checklists/platform/company/${encodeURIComponent(
          companyId
        )}/executions`
      );

    }


    return "/checklists/executions";

  }


  async function loadCompanyData(
    companyId: string
  ) {

    if (!companyId) {

      setTemplates(
        []
      );

      setExecutions(
        []
      );

      return;

    }


    try {

      setLoadingData(
        true
      );

      setError("");


      const [
        templateData,
        executionData,
      ] =
        await Promise.all([
          authorizedFetch(
            templatesBaseUrl(
              companyId
            )
          ),

          authorizedFetch(
            executionsBaseUrl(
              companyId
            )
          ),
        ]);


      setTemplates(
        Array.isArray(
          templateData
        )
          ? (
              templateData as
                ChecklistTemplate[]
            )
          : []
      );


      setExecutions(
        Array.isArray(
          executionData
        )
          ? (
              executionData as
                ChecklistExecution[]
            )
          : []
      );

    } catch (err) {

      console.error(
        "CHECKLIST COMPANY DATA ERROR:",
        err
      );


      setTemplates(
        []
      );

      setExecutions(
        []
      );


      setError(
        getErrorMessage(
          err,
          "Não foi possível carregar os dados do Checklist."
        )
      );

    } finally {

      setLoadingData(
        false
      );

    }

  }


  async function loadExecutionDetail(
    executionId: string
  ) {

    if (
      !selectedCompanyId ||
      !executionId
    ) {

      setExecutionDetail(
        null
      );

      return;

    }


    try {

      setLoadingExecution(
        true
      );

      setError("");


      const data =
        await authorizedFetch(
          `${executionsBaseUrl(
            selectedCompanyId
          )}/${encodeURIComponent(
            executionId
          )}`
        );


      if (
        !data ||
        typeof data !==
          "object"
      ) {

        throw new Error(
          "Resposta inválida da execução."
        );

      }


      setExecutionDetail(
        data as
          ChecklistExecution
      );

      setSelectedExecutionId(
        executionId
      );

    } catch (err) {

      console.error(
        "CHECKLIST EXECUTION DETAIL ERROR:",
        err
      );


      setExecutionDetail(
        null
      );


      setError(
        getErrorMessage(
          err,
          "Não foi possível carregar a execução."
        )
      );

    } finally {

      setLoadingExecution(
        false
      );

    }

  }


  function resetForm() {

    setEditingTemplateId(
      null
    );


    setForm(
      createEmptyForm()
    );

  }


  function updateDraftItem(
    clientId: string,
    patch: Partial<DraftItem>
  ) {

    setForm(
      current => ({
        ...current,

        items:
          current.items.map(
            item =>
              item.clientId ===
                clientId
                ? {
                    ...item,
                    ...patch,
                  }
                : item
          ),
      })
    );

  }


  function addDraftItem() {

    setForm(
      current => ({
        ...current,

        items: [
          ...current.items,
          createEmptyItem(),
        ],
      })
    );

  }


  function removeDraftItem(
    clientId: string
  ) {

    setForm(
      current => {

        if (
          current.items.length <=
          1
        ) {

          return current;

        }


        return {
          ...current,

          items:
            current.items.filter(
              item =>
                item.clientId !==
                clientId
            ),
        };

      }
    );

  }


  function moveDraftItem(
    index: number,
    direction: -1 | 1
  ) {

    setForm(
      current => {

        const target =
          index + direction;


        if (
          target < 0 ||
          target >=
            current.items.length
        ) {

          return current;

        }


        const items = [
          ...current.items,
        ];


        const currentItem =
          items[index];


        items[index] =
          items[target];


        items[target] =
          currentItem;


        return {
          ...current,
          items,
        };

      }
    );

  }


  async function beginEditTemplate(
    templateId: string
  ) {

    if (!selectedCompanyId) {

      return;

    }


    try {

      setActionTemplateId(
        templateId
      );

      setError("");
      setSuccess("");


      const data =
        await authorizedFetch(
          `${templatesBaseUrl(
            selectedCompanyId
          )}/${encodeURIComponent(
            templateId
          )}`
        );


      if (
        !data ||
        typeof data !==
          "object"
      ) {

        throw new Error(
          "Resposta inválida do Template."
        );

      }


      const template =
        data as
          ChecklistTemplate;


      const items =
        Array.isArray(
          template.Items
        )
          ? [
              ...template.Items,
            ].sort(
              (
                first,
                second
              ) =>
                (
                  first.sortOrder ||
                  0
                )
                -
                (
                  second.sortOrder ||
                  0
                )
            )
          : [];


      setEditingTemplateId(
        template.id
      );


      setForm({
        name:
          template.name ||
          "",

        description:
          template.description ||
          "",

        category:
          template.category ||
          "",

        items:
          items.length > 0
            ? items.map(
                item => ({
                  clientId:
                    createClientId(),

                  label:
                    item.label ||
                    "",

                  description:
                    item.description ||
                    "",

                  type:
                    item.type,

                  required:
                    item.required ===
                    true,

                  optionsText:
                    optionsToText(
                      item.options
                    ),
                })
              )
            : [
                createEmptyItem(),
              ],
      });

    } catch (err) {

      console.error(
        "CHECKLIST TEMPLATE DETAIL ERROR:",
        err
      );


      setError(
        getErrorMessage(
          err,
          "Não foi possível abrir o Template."
        )
      );

    } finally {

      setActionTemplateId(
        ""
      );

    }

  }


  async function saveTemplate(
    event: FormEvent
  ) {

    event.preventDefault();


    if (!selectedCompanyId) {

      setError(
        "Selecione uma empresa."
      );

      return;

    }


    const name =
      form.name.trim();


    if (!name) {

      setError(
        "Informe o nome do Template."
      );

      return;

    }


    if (
      form.items.length === 0
    ) {

      setError(
        "Adicione pelo menos um item."
      );

      return;

    }


    const normalizedItems = [];


    for (
      let index = 0;
      index <
        form.items.length;
      index++
    ) {

      const item =
        form.items[index];


      const label =
        item.label.trim();


      if (!label) {

        setError(
          `Informe o título do item ${index + 1}.`
        );

        return;

      }


      let options:
        string[] | undefined;


      if (
        isChoiceType(
          item.type
        )
      ) {

        options =
          parseOptions(
            item.optionsText
          );


        if (
          options.length === 0
        ) {

          setError(
            `Informe as opções do item ${index + 1}.`
          );

          return;

        }

      }


      normalizedItems.push({
        sortOrder:
          index,

        label,

        description:
          item.description.trim() ||
          undefined,

        type:
          item.type,

        required:
          item.required,

        options,
      });

    }


    const payload = {
      name,

      description:
        form.description.trim() ||
        undefined,

      category:
        form.category.trim() ||
        undefined,

      items:
        normalizedItems,
    };


    try {

      setSavingTemplate(
        true
      );

      setError("");
      setSuccess("");


      const base =
        templatesBaseUrl(
          selectedCompanyId
        );


      if (editingTemplateId) {

        await authorizedFetch(
          `${base}/${encodeURIComponent(
            editingTemplateId
          )}`,
          {
            method:
              "PATCH",

            body:
              JSON.stringify(
                payload
              ),
          }
        );


        setSuccess(
          "Template atualizado com sucesso."
        );

      } else {

        await authorizedFetch(
          base,
          {
            method:
              "POST",

            body:
              JSON.stringify(
                payload
              ),
          }
        );


        setSuccess(
          "Template criado com sucesso."
        );

      }


      resetForm();


      await loadCompanyData(
        selectedCompanyId
      );

    } catch (err) {

      console.error(
        "CHECKLIST TEMPLATE SAVE ERROR:",
        err
      );


      setError(
        getErrorMessage(
          err,
          "Não foi possível salvar o Template."
        )
      );

    } finally {

      setSavingTemplate(
        false
      );

    }

  }


  async function archiveTemplate(
    template: ChecklistTemplate
  ) {

    if (
      !selectedCompanyId ||
      template.isActive ===
        false
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        `Arquivar o Template "${template.name}"?`
      );


    if (!confirmed) {

      return;

    }


    try {

      setActionTemplateId(
        template.id
      );

      setError("");
      setSuccess("");


      await authorizedFetch(
        `${templatesBaseUrl(
          selectedCompanyId
        )}/${encodeURIComponent(
          template.id
        )}/archive`,
        {
          method:
            "PATCH",

          body:
            JSON.stringify({}),
        }
      );


      if (
        editingTemplateId ===
        template.id
      ) {

        resetForm();

      }


      setSuccess(
        "Template arquivado."
      );


      await loadCompanyData(
        selectedCompanyId
      );

    } catch (err) {

      console.error(
        "CHECKLIST ARCHIVE ERROR:",
        err
      );


      setError(
        getErrorMessage(
          err,
          "Não foi possível arquivar o Template."
        )
      );

    } finally {

      setActionTemplateId(
        ""
      );

    }

  }


  useEffect(
    () => {

      if (authLoading) {

        return;

      }


      if (isPlatformRole) {

        void loadCompanies();

        return;

      }


      setLoadingCompanies(
        false
      );


      if (!tenantCompanyId) {

        setCompanies(
          []
        );

        setSelectedCompanyId(
          ""
        );

        setError(
          "Empresa da sessão não identificada."
        );

        return;

      }


      setCompanies([
        {
          id:
            tenantCompanyId,

          name:
            tenantCompanyName,

          isActive:
            true,
        },
      ]);


      setSelectedCompanyId(
        tenantCompanyId
      );

    },
    [
      authLoading,
      isPlatformRole,
      tenantCompanyId,
      tenantCompanyName,
    ]
  );


  useEffect(
    () => {

      setSelectedExecutionId(
        ""
      );

      setExecutionDetail(
        null
      );

      resetForm();


      if (
        selectedCompanyId
      ) {

        void loadCompanyData(
          selectedCompanyId
        );

      } else {

        setTemplates(
          []
        );

        setExecutions(
          []
        );

      }

    },
    [
      selectedCompanyId,
    ]
  );


  return (
    <div
      className="
        min-h-screen
        bg-slate-950
        px-4
        py-6
        text-slate-100
        sm:px-6
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          gap-6
        "
      >
        <section
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900/80
            p-6
            shadow-2xl
            shadow-black/20
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
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-cyan-400
                "
              >
                Execução
              </p>

              <h1
                className="
                  mt-2
                  text-3xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                Checklist
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
                Crie os padrões operacionais
                das empresas e acompanhe as
                execuções registradas em campo.
              </p>
            </div>

            <div
              className="
                w-full
                lg:max-w-md
              "
            >
              <label
                className="
                  text-sm
                  font-medium
                  text-slate-300
                "
              >
                Empresa
              </label>

              <select
                className={inputClass}
                value={
                  selectedCompanyId
                }
                disabled={
                  loadingCompanies ||
                  !isPlatformRole
                }
                onChange={
                  event =>
                    setSelectedCompanyId(
                      event.target.value
                    )
                }
              >
                <option value="">
                  {loadingCompanies
                    ? "Carregando empresas..."
                    : "Selecione a empresa"}
                </option>

                {companies.map(
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
                      {company.isActive ===
                      false
                        ? " — inativa"
                        : ""}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </section>


        {error ? (
          <div
            className="
              rounded-xl
              border
              border-red-900
              bg-red-950/50
              px-4
              py-3
              text-sm
              text-red-200
            "
          >
            {error}
          </div>
        ) : null}


        {success ? (
          <div
            className="
              rounded-xl
              border
              border-emerald-900
              bg-emerald-950/50
              px-4
              py-3
              text-sm
              text-emerald-200
            "
          >
            {success}
          </div>
        ) : null}


        <section
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-6
          "
        >
          {[
            {
              label:
                "Templates",
              value:
                templates.length,
            },
            {
              label:
                "Ativos",
              value:
                activeTemplates,
            },
            {
              label:
                "Em andamento",
              value:
                executionStats
                  .IN_PROGRESS,
            },
            {
              label:
                "Concluídos",
              value:
                executionStats
                  .COMPLETED,
            },
            {
              label:
                "Cancelados",
              value:
                executionStats
                  .CANCELLED,
            },
            {
              label:
                "Rascunhos",
              value:
                executionStats
                  .DRAFT,
            },
          ].map(
            item => (
              <div
                key={
                  item.label
                }
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900
                  p-5
                "
              >
                <p
                  className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-slate-500
                  "
                >
                  {item.label}
                </p>

                <p
                  className="
                    mt-2
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  {item.value}
                </p>
              </div>
            )
          )}
        </section>


        <div
          className="
            grid
            gap-6
            xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]
          "
        >
          <section
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-5
            "
          >
            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-semibold
                    text-white
                  "
                >
                  Templates
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  {selectedCompany
                    ? selectedCompany.name
                    : "Selecione uma empresa"}
                </p>
              </div>

              <button
                type="button"
                disabled={
                  !selectedCompanyId ||
                  loadingData
                }
                onClick={
                  () => {
                    setError("");
                    setSuccess("");

                    if (
                      selectedCompanyId
                    ) {

                      void loadCompanyData(
                        selectedCompanyId
                      );

                    }
                  }
                }
                className="
                  rounded-xl
                  border
                  border-slate-700
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-slate-200
                  transition
                  hover:border-cyan-600
                  hover:text-cyan-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Atualizar
              </button>
            </div>


            <div
              className="
                mt-5
                space-y-3
              "
            >
              {loadingData ? (
                <p
                  className="
                    py-8
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  Carregando...
                </p>
              ) : null}


              {!loadingData &&
              templates.length ===
                0 ? (
                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-700
                    p-8
                    text-center
                  "
                >
                  <p
                    className="
                      text-sm
                      text-slate-400
                    "
                  >
                    Nenhum Template
                    cadastrado nesta empresa.
                  </p>
                </div>
              ) : null}


              {templates.map(
                template => (
                  <article
                    key={
                      template.id
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950/70
                      p-4
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        md:flex-row
                        md:items-start
                        md:justify-between
                      "
                    >
                      <div
                        className="
                          min-w-0
                        "
                      >
                        <div
                          className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                          "
                        >
                          <h3
                            className="
                              font-semibold
                              text-white
                            "
                          >
                            {template.name}
                          </h3>

                          <span
                            className={`
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-medium
                              ${
                                template
                                  .isActive
                                  ? `
                                      bg-emerald-950
                                      text-emerald-300
                                    `
                                  : `
                                      bg-slate-800
                                      text-slate-400
                                    `
                              }
                            `}
                          >
                            {template.isActive
                              ? "Ativo"
                              : "Arquivado"}
                          </span>
                        </div>

                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-slate-400
                          "
                        >
                          {template.description ||
                            "Sem descrição."}
                        </p>

                        <div
                          className="
                            mt-3
                            flex
                            flex-wrap
                            gap-x-5
                            gap-y-1
                            text-xs
                            text-slate-500
                          "
                        >
                          <span>
                            Categoria:{" "}
                            {template.category ||
                              "—"}
                          </span>

                          <span>
                            Itens:{" "}
                            {template.Items
                              ?.length ??
                              "—"}
                          </span>

                          <span>
                            Atualizado:{" "}
                            {formatDate(
                              template.updatedAt
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          shrink-0
                          flex-wrap
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          disabled={
                            actionTemplateId ===
                            template.id
                          }
                          onClick={
                            () =>
                              void beginEditTemplate(
                                template.id
                              )
                          }
                          className="
                            rounded-lg
                            border
                            border-cyan-800
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-cyan-300
                            transition
                            hover:bg-cyan-950
                            disabled:opacity-50
                          "
                        >
                          Editar
                        </button>

                        {template.isActive ? (
                          <button
                            type="button"
                            disabled={
                              actionTemplateId ===
                              template.id
                            }
                            onClick={
                              () =>
                                void archiveTemplate(
                                  template
                                )
                            }
                            className="
                              rounded-lg
                              border
                              border-amber-900
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-amber-300
                              transition
                              hover:bg-amber-950
                              disabled:opacity-50
                            "
                          >
                            Arquivar
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </section>


          <section
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
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
              <div>
                <h2
                  className="
                    text-xl
                    font-semibold
                    text-white
                  "
                >
                  {editingTemplateId
                    ? "Editar Template"
                    : "Novo Template"}
                </h2>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  Defina os itens que serão
                  copiados como snapshot nas
                  execuções.
                </p>
              </div>

              {editingTemplateId ? (
                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="
                    rounded-lg
                    border
                    border-slate-700
                    px-3
                    py-2
                    text-xs
                    text-slate-300
                    hover:border-slate-500
                  "
                >
                  Novo
                </button>
              ) : null}
            </div>


            <form
              className="
                mt-5
                space-y-5
              "
              onSubmit={
                event =>
                  void saveTemplate(
                    event
                  )
              }
            >
              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-slate-300
                "
              >
                Nome

                <input
                  className={inputClass}
                  value={
                    form.name
                  }
                  onChange={
                    event =>
                      setForm(
                        current => ({
                          ...current,
                          name:
                            event
                              .target
                              .value,
                        })
                      )
                  }
                  placeholder="Ex.: Instalação FTTH"
                />
              </label>


              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-slate-300
                "
              >
                Categoria

                <input
                  className={inputClass}
                  value={
                    form.category
                  }
                  onChange={
                    event =>
                      setForm(
                        current => ({
                          ...current,
                          category:
                            event
                              .target
                              .value,
                        })
                      )
                  }
                  placeholder="Ex.: Instalação"
                />
              </label>


              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-slate-300
                "
              >
                Descrição

                <textarea
                  className={inputClass}
                  rows={3}
                  value={
                    form.description
                  }
                  onChange={
                    event =>
                      setForm(
                        current => ({
                          ...current,
                          description:
                            event
                              .target
                              .value,
                        })
                      )
                  }
                  placeholder="Objetivo e aplicação do checklist."
                />
              </label>


              <div>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <h3
                    className="
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Itens
                  </h3>

                  <button
                    type="button"
                    onClick={
                      addDraftItem
                    }
                    className="
                      rounded-lg
                      border
                      border-cyan-800
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-cyan-300
                      hover:bg-cyan-950
                    "
                  >
                    + Adicionar item
                  </button>
                </div>


                <div
                  className="
                    mt-3
                    space-y-4
                  "
                >
                  {form.items.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          item.clientId
                        }
                        className="
                          rounded-xl
                          border
                          border-slate-800
                          bg-slate-950/60
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >
                          <span
                            className="
                              text-xs
                              font-semibold
                              uppercase
                              tracking-wide
                              text-slate-500
                            "
                          >
                            Item{" "}
                            {index + 1}
                          </span>

                          <div
                            className="
                              flex
                              gap-1
                            "
                          >
                            <button
                              type="button"
                              disabled={
                                index === 0
                              }
                              onClick={
                                () =>
                                  moveDraftItem(
                                    index,
                                    -1
                                  )
                              }
                              className="
                                rounded
                                border
                                border-slate-700
                                px-2
                                py-1
                                text-xs
                                text-slate-400
                                disabled:opacity-30
                              "
                            >
                              ↑
                            </button>

                            <button
                              type="button"
                              disabled={
                                index ===
                                form.items
                                  .length -
                                  1
                              }
                              onClick={
                                () =>
                                  moveDraftItem(
                                    index,
                                    1
                                  )
                              }
                              className="
                                rounded
                                border
                                border-slate-700
                                px-2
                                py-1
                                text-xs
                                text-slate-400
                                disabled:opacity-30
                              "
                            >
                              ↓
                            </button>

                            <button
                              type="button"
                              disabled={
                                form.items
                                  .length <=
                                1
                              }
                              onClick={
                                () =>
                                  removeDraftItem(
                                    item.clientId
                                  )
                              }
                              className="
                                rounded
                                border
                                border-red-900
                                px-2
                                py-1
                                text-xs
                                text-red-400
                                disabled:opacity-30
                              "
                            >
                              Remover
                            </button>
                          </div>
                        </div>


                        <label
                          className="
                            mt-3
                            block
                            text-xs
                            font-medium
                            text-slate-400
                          "
                        >
                          Título

                          <input
                            className={inputClass}
                            value={
                              item.label
                            }
                            onChange={
                              event =>
                                updateDraftItem(
                                  item.clientId,
                                  {
                                    label:
                                      event
                                        .target
                                        .value,
                                  }
                                )
                            }
                          />
                        </label>


                        <label
                          className="
                            mt-3
                            block
                            text-xs
                            font-medium
                            text-slate-400
                          "
                        >
                          Descrição

                          <input
                            className={inputClass}
                            value={
                              item.description
                            }
                            onChange={
                              event =>
                                updateDraftItem(
                                  item.clientId,
                                  {
                                    description:
                                      event
                                        .target
                                        .value,
                                  }
                                )
                            }
                          />
                        </label>


                        <div
                          className="
                            mt-3
                            grid
                            gap-3
                            sm:grid-cols-2
                          "
                        >
                          <label
                            className="
                              block
                              text-xs
                              font-medium
                              text-slate-400
                            "
                          >
                            Tipo

                            <select
                              className={inputClass}
                              value={
                                item.type
                              }
                              onChange={
                                event =>
                                  updateDraftItem(
                                    item.clientId,
                                    {
                                      type:
                                        event
                                          .target
                                          .value as
                                          ChecklistItemType,
                                    }
                                  )
                              }
                            >
                              {TYPE_OPTIONS.map(
                                option => (
                                  <option
                                    key={
                                      option.value
                                    }
                                    value={
                                      option.value
                                    }
                                  >
                                    {option.label}
                                  </option>
                                )
                              )}
                            </select>
                          </label>


                          <label
                            className="
                              flex
                              items-center
                              gap-3
                              self-end
                              rounded-xl
                              border
                              border-slate-800
                              bg-slate-950
                              px-4
                              py-3
                              text-sm
                              text-slate-300
                            "
                          >
                            <input
                              type="checkbox"
                              checked={
                                item.required
                              }
                              onChange={
                                event =>
                                  updateDraftItem(
                                    item.clientId,
                                    {
                                      required:
                                        event
                                          .target
                                          .checked,
                                    }
                                  )
                              }
                            />

                            Obrigatório
                          </label>
                        </div>


                        {isChoiceType(
                          item.type
                        ) ? (
                          <label
                            className="
                              mt-3
                              block
                              text-xs
                              font-medium
                              text-slate-400
                            "
                          >
                            Opções — uma por linha

                            <textarea
                              className={inputClass}
                              rows={4}
                              value={
                                item.optionsText
                              }
                              onChange={
                                event =>
                                  updateDraftItem(
                                    item.clientId,
                                    {
                                      optionsText:
                                        event
                                          .target
                                          .value,
                                    }
                                  )
                              }
                              placeholder={`Opção A
Opção B
Opção C`}
                            />
                          </label>
                        ) : null}
                      </div>
                    )
                  )}
                </div>
              </div>


              <button
                type="submit"
                disabled={
                  savingTemplate ||
                  !selectedCompanyId
                }
                className="
                  w-full
                  rounded-xl
                  bg-cyan-600
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-cyan-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {savingTemplate
                  ? "Salvando..."
                  : editingTemplateId
                    ? "Salvar alterações"
                    : "Criar Template"}
              </button>
            </form>
          </section>
        </div>


        <div
          className="
            grid
            gap-6
            xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
          "
        >
          <section
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-5
            "
          >
            <div>
              <h2
                className="
                  text-xl
                  font-semibold
                  text-white
                "
              >
                Execuções
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Histórico da empresa
                selecionada.
              </p>
            </div>


            <div
              className="
                mt-5
                max-h-[720px]
                space-y-3
                overflow-y-auto
                pr-1
              "
            >
              {!loadingData &&
              executions.length ===
                0 ? (
                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-700
                    p-8
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  Nenhuma execução
                  registrada.
                </div>
              ) : null}


              {executions.map(
                execution => (
                  <button
                    type="button"
                    key={
                      execution.id
                    }
                    onClick={
                      () =>
                        void loadExecutionDetail(
                          execution.id
                        )
                    }
                    className={`
                      block
                      w-full
                      rounded-xl
                      border
                      p-4
                      text-left
                      transition
                      ${
                        selectedExecutionId ===
                        execution.id
                          ? `
                              border-cyan-700
                              bg-cyan-950/30
                            `
                          : `
                              border-slate-800
                              bg-slate-950/60
                              hover:border-slate-700
                            `
                      }
                    `}
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <div
                        className="
                          min-w-0
                        "
                      >
                        <p
                          className="
                            truncate
                            font-medium
                            text-white
                          "
                        >
                          {execution
                            .Template
                            ?.name ||
                            `Template ${execution.templateId.slice(
                              0,
                              8
                            )}`}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          {formatDate(
                            execution.startedAt
                          )}
                        </p>
                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-full
                          bg-slate-800
                          px-2
                          py-1
                          text-[11px]
                          font-semibold
                          text-slate-300
                        "
                      >
                        {STATUS_LABELS[
                          execution.status
                        ] ||
                          execution.status}
                      </span>
                    </div>

                    {execution.notes ? (
                      <p
                        className="
                          mt-3
                          line-clamp-2
                          text-xs
                          text-slate-400
                        "
                      >
                        {execution.notes}
                      </p>
                    ) : null}
                  </button>
                )
              )}
            </div>
          </section>


          <section
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-900
              p-5
            "
          >
            <h2
              className="
                text-xl
                font-semibold
                text-white
              "
            >
              Detalhes da execução
            </h2>


            {loadingExecution ? (
              <p
                className="
                  py-10
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                Carregando execução...
              </p>
            ) : null}


            {!loadingExecution &&
            !executionDetail ? (
              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-dashed
                  border-slate-700
                  p-10
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                Selecione uma execução
                para visualizar o snapshot
                e as respostas.
              </div>
            ) : null}


            {!loadingExecution &&
            executionDetail ? (
              <div
                className="
                  mt-5
                  space-y-5
                "
              >
                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-2
                  "
                >
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950/60
                      p-4
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Status
                    </p>

                    <p
                      className="
                        mt-2
                        font-semibold
                        text-white
                      "
                    >
                      {STATUS_LABELS[
                        executionDetail
                          .status
                      ] ||
                        executionDetail
                          .status}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950/60
                      p-4
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Iniciada
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-white
                      "
                    >
                      {formatDate(
                        executionDetail
                          .startedAt
                      )}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950/60
                      p-4
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Técnico
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-white
                      "
                    >
                      {executionDetail
                        .TechnicianProfile
                        ?.User
                        ?.name ||
                        "Não vinculado"}
                    </p>
                  </div>

                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950/60
                      p-4
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Concluída
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-white
                      "
                    >
                      {formatDate(
                        executionDetail
                          .completedAt
                      )}
                    </p>
                  </div>
                </div>


                {executionDetail.notes ? (
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-800
                      bg-slate-950/60
                      p-4
                    "
                  >
                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wide
                        text-slate-500
                      "
                    >
                      Observações
                    </p>

                    <p
                      className="
                        mt-2
                        whitespace-pre-wrap
                        text-sm
                        text-slate-300
                      "
                    >
                      {executionDetail.notes}
                    </p>
                  </div>
                ) : null}


                <div>
                  <h3
                    className="
                      text-sm
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-400
                    "
                  >
                    Snapshot dos itens
                  </h3>

                  <div
                    className="
                      mt-3
                      space-y-3
                    "
                  >
                    {(
                      executionDetail
                        .Items ||
                      []
                    )
                      .slice()
                      .sort(
                        (
                          first,
                          second
                        ) =>
                          (
                            first
                              .sortOrderSnapshot ||
                            0
                          )
                          -
                          (
                            second
                              .sortOrderSnapshot ||
                            0
                          )
                      )
                      .map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={
                              item.id
                            }
                            className="
                              rounded-xl
                              border
                              border-slate-800
                              bg-slate-950/60
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-2
                              "
                            >
                              <p
                                className="
                                  font-medium
                                  text-white
                                "
                              >
                                {index + 1}.{" "}
                                {
                                  item.labelSnapshot
                                }
                              </p>

                              <span
                                className="
                                  rounded-full
                                  bg-slate-800
                                  px-2
                                  py-1
                                  text-[11px]
                                  text-slate-400
                                "
                              >
                                {
                                  item.typeSnapshot
                                }
                                {item.requiredSnapshot
                                  ? " • obrigatório"
                                  : ""}
                              </span>
                            </div>

                            <div
                              className="
                                mt-3
                                rounded-lg
                                border
                                border-slate-800
                                bg-slate-900
                                px-3
                                py-3
                              "
                            >
                              <p
                                className="
                                  text-[11px]
                                  uppercase
                                  tracking-wide
                                  text-slate-500
                                "
                              >
                                Resposta
                              </p>

                              <p
                                className="
                                  mt-1
                                  whitespace-pre-wrap
                                  break-words
                                  text-sm
                                  text-slate-200
                                "
                              >
                                {formatValue(
                                  item.response
                                )}
                              </p>
                            </div>

                            {item.observation ? (
                              <p
                                className="
                                  mt-3
                                  text-xs
                                  text-slate-400
                                "
                              >
                                Observação:{" "}
                                {
                                  item.observation
                                }
                              </p>
                            ) : null}
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );

}
