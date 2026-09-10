"use client";

import {
  useCallback,
  useEffect,
  useMemo,
    useRef,
  useState,
} from "react";

import {
  AlertCircle,
  Building2,
  Check,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

type PermissionItem = {
  key: string;
  label: string;
  description: string;
};

type AdminPermissionsResponse = {
  companyId: string;
  role: string;
  permissions: string[];
};

type CompanyOption = {
  id: string;
  name: string;
  isActive?: boolean;
};

const ADMIN_MODULES: PermissionItem[] = [
  {
    key: "module.dashboard",
    label: "Dashboard",
    description: "Libera toda a barra Dashboard.",
  },
  {
    key: "module.training",
    label: "Treinamentos",
    description:
      "Libera a barra completa de Treinamentos e suas opções.",
  },
  {
    key: "module.files",
    label: "Telecomunicação",
    description:
      "Libera a barra completa de Telecomunicação e suas opções.",
  },
  {
    key: "module.projects",
    label: "Projetos",
    description:
      "Libera a barra completa de Projetos e suas opções.",
  },
  {
    key: "module.execution",
    label: "Execução",
    description:
      "Libera a barra completa de Execução e suas opções.",
  },
  {
    key: "module.company",
    label: "Empresa",
    description:
      "Libera a barra completa de Empresa e suas opções.",
  },
  {
    key: "module.settings",
    label: "Configurações",
    description:
      "Libera Configurações e o Financeiro dentro dela.",
  },
];

const ADMIN_MODULE_KEYS =
  new Set(
    ADMIN_MODULES.map(
      module => module.key
    )
  );

const MODULE_PERMISSION_MAP: Record<
  string,
  string[]
> = {
  "module.dashboard": [
    "module.dashboard",
  ],

  "module.training": [
    "module.training",
    "training.view",
  ],

  "module.files": [
    "module.files",
    "files.view",
    "files.download",
  ],

  "module.projects": [
    "module.projects",
    "projects.view",
    "projects.edit",
    "kmz.view",
    "kmz.edit",
  ],

  "module.execution": [
    "module.execution",
  ],

  "module.company": [
    "module.company",
    "company.view",
    "company.edit",
    "company.users",
  ],

  "module.settings": [
    "module.settings",
    "finance.view",
  ],
};

function getApiUrl() {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL;

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
    localStorage.getItem("token");

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
        cache: "no-store",
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,

          ...(options.headers || {}),
        },
      }
    );

  const text =
    await response.text();

  let data: unknown = null;

  try {
    data =
      text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data
        ? String(
            (
              data as {
                message?: unknown;
              }
            ).message || ""
          )
        : "";

    throw new Error(
      message ||
        `API_${response.status}`
    );
  }

  return data;
}

function permissionLabel(
  key: string
) {
  const labels: Record<
    string,
    string
  > = {
    "dashboard.view":
      "Visualizar Dashboard",

    "company.view":
      "Visualizar Empresa",

    "company.edit":
      "Editar Empresa",

    "company.users":
      "Usuários da Empresa",

    "projects.view":
      "Visualizar Projetos",

    "projects.edit":
      "Editar Projetos",

    "kmz.view":
      "Visualizar KMZ",

    "kmz.edit":
      "Editar KMZ",

    "trt.view":
      "Visualizar TRT",

    "trt.approve":
      "Aprovar TRT",

    "files.view":
      "Visualizar Arquivos",

    "files.download":
      "Baixar Arquivos",

    "finance.view":
      "Visualizar Financeiro",

    "training.view":
      "Visualizar Treinamentos",

    "companies.manage":
      "Gerenciar Empresas",

    "plans.manage":
      "Gerenciar Planos",

    "users.manage":
      "Gerenciar Usuários",
  };

  return (
    labels[key] ||
    key
  );
}

function permissionDescription(
  key: string
) {
  const descriptions: Record<
    string,
    string
  > = {
    "dashboard.view":
      "Permite acessar o painel principal.",

    "projects.view":
      "Permite visualizar projetos da empresa.",

    "companies.manage":
      "Permite administrar empresas.",

    "plans.manage":
      "Permite administrar planos SaaS.",

    "users.manage":
      "Permite administrar usuários.",
  };

  return (
    descriptions[key] ||
    "Permissão disponibilizada pelo sistema."
  );
}

export default function PermissoesPage() {
  const auth =
    useContext(AuthContext);

  const user =
    auth?.user || null;

  const [catalog, setCatalog] =
    useState<PermissionItem[]>([]);

  const [selected, setSelected] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [companies, setCompanies] =
    useState<CompanyOption[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] =
    useState("");

    /*
     * ETAPA29_QUERY_COMPANY_SYNC
     *
     * Aplicamos ?companyId= apenas uma vez.
     * Depois disso o MASTER continua livre
     * para trocar manualmente de empresa.
     */
    const queryCompanyApplied =
      useRef(false);



  const ownCompanyId =
    user?.companyId ||
    user?.company?.id ||
    "";

  const ownCompanyName =
    user?.company?.name ||
    user?.companyName ||
    "Empresa atual";

  const isPlatformRole =
    user?.role === "ROOT" ||
    user?.role === "MASTER";

  const companyId =
    isPlatformRole
      ? selectedCompanyId
      : ownCompanyId;

  const companyName =
    isPlatformRole
      ? (
          companies.find(
            company =>
              company.id === selectedCompanyId
          )?.name ||
          "Empresa"
        )
      : ownCompanyName;

  const canManage =
    user?.role === "ROOT" ||
    user?.role === "MASTER";

  const loadCompanies =
    useCallback(async () => {
      if (!isPlatformRole) {
        return;
      }

      try {
        setError("");

        const data =
          await authorizedFetch(
            "/admin/companies"
          );

        const list =
          Array.isArray(data)
            ? data
            : [];

        const normalized =
          list
            .filter(
              (item): item is {
                id: string;
                name?: string;
                isActive?: boolean;
              } =>
                Boolean(
                  item &&
                  typeof item === "object" &&
                  "id" in item
                )
            )
            .map(item => ({
              id: item.id,
              name:
                typeof item.name === "string" &&
                item.name.trim()
                  ? item.name
                  : `Empresa ${item.id}`,
              isActive:
                typeof item.isActive === "boolean"
                  ? item.isActive
                  : undefined,
            }));

        setCompanies(normalized);

        if (
          !selectedCompanyId &&
          ownCompanyId
        ) {
          const ownCompany =
            normalized.find(
              company =>
                company.id === ownCompanyId
            );

          if (ownCompany) {
            setSelectedCompanyId(
              ownCompany.id
            );
          } else if (normalized.length > 0) {
            setSelectedCompanyId(
              normalized[0].id
            );
          }
        }
      } catch (err) {
        console.error(
          "COMPANIES LOAD ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar as empresas."
        );
      }
    }, [
      isPlatformRole,
      ownCompanyId,
      selectedCompanyId,
    ]);

  const loadPermissions =
    useCallback(async () => {
      if (
        isPlatformRole &&
        !selectedCompanyId
      ) {
        setLoading(true);
        setError("");
        return;
      }

      if (!companyId) {
        setError(
          "Empresa não identificada na sessão."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const [
          permissionsData,
          adminData,
        ] = await Promise.all([
          authorizedFetch(
            "/roles/permissions"
          ),

          authorizedFetch(
            `/roles/company/${companyId}/admin`
          ),
        ]);

        const permissionList =
          Array.isArray(
            permissionsData
          )
            ? permissionsData
            : [];

        const normalizedCatalog =
          permissionList.map(
            (item: unknown) => {
              if (
                typeof item === "string"
              ) {
                return {
                  key: item,
                  label:
                    permissionLabel(item),
                  description:
                    permissionDescription(
                      item
                    ),
                };
              }

              if (
                item &&
                typeof item ===
                  "object" &&
                "key" in item
              ) {
                const obj =
                  item as {
                    key: string;
                    label?: string;
                    description?: string;
                  };

                return {
                  key: obj.key,
                  label:
                    permissionLabel(
                      obj.key
                    ) !== obj.key
                      ? permissionLabel(
                          obj.key
                        )
                      : (
                          obj.label ||
                          permissionLabel(
                            obj.key
                          )
                        ),
                  description:
                    obj.description ||
                    permissionDescription(
                      obj.key
                    ),
                };
              }

              return null;
            }
          )
          .filter(
            (
              item
            ): item is PermissionItem =>
              Boolean(item?.key)
          );

        setCatalog(
          ADMIN_MODULES
        );

        const adminPermissions =
          (
            adminData as
              AdminPermissionsResponse
          )?.permissions;

        setSelected(
          Array.isArray(
            adminPermissions
          )
            ? adminPermissions
            : []
        );
      } catch (err) {
        console.error(
          "PERMISSIONS LOAD ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Não foi possível carregar as permissões."
        );
      } finally {
        setLoading(false);
      }
    }, [
      companyId,
      isPlatformRole,
      selectedCompanyId,
    ]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

    /*
     * ETAPA29:
     * /configuracoes/permissoes?companyId=XYZ
     *
     * Permite:
     * MASTER -> Empresas -> Permissões
     *
     * Sem impedir alteração manual posterior
     * no seletor de empresas.
     */
    useEffect(() => {

      if (
        queryCompanyApplied.current ||
        !isPlatformRole ||
        companies.length === 0
      ) {
        return;
      }

      const requestedCompanyId =
        new URLSearchParams(
          window.location.search
        ).get("companyId") || "";

      if (!requestedCompanyId) {
        queryCompanyApplied.current = true;
        return;
      }

      const requestedCompany =
        companies.find(
          company =>
            company.id === requestedCompanyId
        );

      if (requestedCompany) {
        setSelectedCompanyId(
          requestedCompany.id
        );
      }

      queryCompanyApplied.current = true;

    }, [
      companies,
      isPlatformRole,
    ]);


  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  const selectedSet =
    useMemo(
      () =>
        new Set(selected),
      [selected]
    );

  function togglePermission(
    key: string
  ) {
    setSuccess("");
    setError("");

    const mapped =
      MODULE_PERMISSION_MAP[key] ||
      [key];

    setSelected(
      current => {
        const enabled =
          current.includes(key);

        if (enabled) {
          return current.filter(
            item => !mapped.includes(item)
          );
        }

        return Array.from(
          new Set([
            ...current,
            ...mapped,
          ])
        );
      }
    );
  }

  function selectAll() {
    setSuccess("");
    setError("");

    setSelected(
      current => {
        const preserved =
          current.filter(
            permission =>
              !Array.from(
                Object.values(MODULE_PERMISSION_MAP)
              )
                .flat()
                .includes(permission)
          );

        const allModulePermissions =
          ADMIN_MODULES.flatMap(
            module =>
              MODULE_PERMISSION_MAP[
                module.key
              ] || [module.key]
          );

        return Array.from(
          new Set([
            ...preserved,
            ...allModulePermissions,
          ])
        );
      }
    );
  }

  function clearAll() {
    setSuccess("");
    setError("");

    const managedPermissions =
      Array.from(
        Object.values(MODULE_PERMISSION_MAP)
      ).flat();

    setSelected(
      current =>
        current.filter(
          permission =>
            !managedPermissions.includes(
              permission
            )
        )
    );
  }

  async function savePermissions() {
    if (!companyId) {
      setError(
        "Empresa não identificada."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await authorizedFetch(
        `/roles/company/${companyId}/admin`,
        {
          method: "PUT",
          body: JSON.stringify({
            permissions:
              selected,
          }),
        }
      );

      setSuccess(
        "Permissões do ADMIN salvas com sucesso."
      );

      await loadPermissions();
    } catch (err) {
      console.error(
        "PERMISSIONS SAVE ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar as permissões."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!canManage) {
    return (
      <main className="min-h-full p-4 lg:p-8 text-white">
        <section className="mx-auto max-w-5xl rounded-3xl border border-red-900/50 bg-red-950/20 p-8">
          <div className="flex items-center gap-3 text-red-300">
            <AlertCircle
              size={24}
            />

            <h1 className="text-xl font-bold">
              Acesso negado
            </h1>
          </div>

          <p className="mt-3 text-sm text-red-200/80">
            Seu perfil não possui autorização
            para administrar permissões.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-full p-4 lg:p-8 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
              <ShieldCheck
                size={24}
              />
            </div>

            <div>
              <h1 className="text-2xl font-black lg:text-4xl">
                Permissões
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Controle real de permissões
                do GeoFiber Enterprise.
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-800 bg-[#081223] p-5 lg:p-8">

          <div className="mb-7 grid gap-4 lg:grid-cols-2">

            <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
              <div className="flex items-start gap-3">
                <Building2
                  size={20}
                  className="mt-1 shrink-0 text-cyan-400"
                />

                <div className="min-w-0 flex-1">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Empresa
                  </div>

                  {isPlatformRole ? (
                    <div className="mt-2">
                      <select
                        value={selectedCompanyId}
                        onChange={event =>
                          setSelectedCompanyId(
                            event.target.value
                          )
                        }
                        disabled={
                          loading ||
                          saving ||
                          companies.length === 0
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm font-bold text-white outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {companies.length === 0 ? (
                          <option value="">
                            Carregando empresas...
                          </option>
                        ) : (
                          companies.map(company => (
                            <option
                              key={company.id}
                              value={company.id}
                            >
                              {company.name}
                              {company.isActive === false
                                ? " — INATIVA"
                                : ""}
                            </option>
                          ))
                        )}
                      </select>

                      <div className="mt-2 break-all text-xs text-slate-500">
                        {companyId ||
                          "Empresa não identificada"}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-1 font-bold text-white">
                        {companyName}
                      </div>

                      <div className="mt-1 break-all text-xs text-slate-500">
                        {companyId ||
                          "Empresa não identificada"}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/40 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Perfil configurado
              </div>

              <div className="mt-1 font-bold text-cyan-400">
                ADMIN
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Permissões administrativas da empresa.
              </div>
            </div>

          </div>

          {error ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-300">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                {error}
              </span>
            </div>
          ) : null}

          {success ? (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-900/50 bg-emerald-950/30 p-4 text-sm text-emerald-300">
              <Check
                size={18}
                className="mt-0.5 shrink-0"
              />

              <span>
                {success}
              </span>
            </div>
          ) : null}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Permissões do ADMIN
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {ADMIN_MODULES.filter(
                  module =>
                    selectedSet.has(
                      module.key
                    )
                ).length} de{" "}
                {ADMIN_MODULES.length} módulos
                habilitados.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={selectAll}
                disabled={
                  loading ||
                  saving ||
                  catalog.length === 0
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Selecionar todas
              </button>

              <button
                type="button"
                onClick={clearAll}
                disabled={
                  loading ||
                  saving ||
                  selected.length === 0
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 transition hover:border-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpar
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Carregando permissões...
              </div>
            </div>
          ) : catalog.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center text-sm text-slate-500">
              Nenhum módulo foi disponibilizado
              pelo backend.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {catalog.map(
                permission => {
                  const checked =
                    selectedSet.has(
                      permission.key
                    );

                  return (
                    <label
                      key={
                        permission.key
                      }
                      className={`
                        flex cursor-pointer
                        items-start gap-3
                        rounded-2xl border
                        p-4 transition
                        ${
                          checked
                            ? "border-cyan-500/60 bg-cyan-500/10"
                            : "border-slate-700 bg-slate-950/50 hover:border-slate-600"
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          togglePermission(
                            permission.key
                          )
                        }
                        disabled={
                          saving
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-cyan-500"
                      />

                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100">
                          {
                            permission.label
                          }
                        </div>

                        <div className="mt-2 text-xs leading-5 text-slate-500">
                          {
                            permission.description
                          }
                        </div>
                      </div>
                    </label>
                  );
                }
              )}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Os módulos habilitados serão exibidos
              completos no menu do ADMIN desta empresa.
            </div>

            <button
              type="button"
              onClick={
                savePermissions
              }
              disabled={
                loading ||
                saving ||
                !companyId
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving
                ? "Salvando..."
                : "Salvar permissões"}
            </button>
          </div>

        </section>
      </div>
    </main>
  );
}
