"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";


type CompanyUser = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: string;
};


type PermissionOption = {
  key: string;
  description?: string | null;
};


type PermissionPayload = {
  companyId: string;

  user: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };

  role: {
    id: string;
    name: string;
  };

  availablePermissions:
    PermissionOption[];

  permissions: string[];

  outsideCeilingPermissions:
    string[];

  delegatedRoleId:
    string | null;
};


type ModulePermissionGroup = {
  id: string;
  label: string;
  description: string;
  permissions: string[];
};


const PROTECTED_ROLES =
  new Set([
    "ROOT",
    "MASTER",
    "ADMIN",
  ]);


/*
 * ETAPA35A3D_FIVE_MODULES_ONLY
 *
 * Esta é a única lista exibida
 * ao ADMIN para usuários comuns.
 *
 * Chaves técnicas nunca aparecem
 * na interface.
 */
const MODULE_PERMISSION_GROUPS:
  ModulePermissionGroup[] = [

    {
      id: "dashboard",
      label: "Dashboard",
      description:
        "Acesso ao painel principal da empresa.",
      permissions: [
        "module.dashboard",
      ],
    },

    {
      id: "training",
      label: "Treinamentos",
      description:
        "Acesso aos treinamentos disponibilizados pela empresa.",
      permissions: [
        "module.training",
        "training.view",
      ],
    },

    {
      id: "files",
      label: "Telecomunicação",
      description:
        "Acesso a documentos, arquivos, KMZ e documentação técnica.",
      permissions: [
        "module.files",
        "files.view",
        "files.download",
        "kmz.view",
        "kmz.edit",
        "trt.view",
        "trt.approve",
      ],
    },

    {
      id: "projects",
      label: "Projetos",
      description:
        "Acesso aos projetos e recursos relacionados.",
      permissions: [
        "module.projects",
        "projects.view",
        "projects.edit",
      ],
    },

    {
      id: "execution",
      label: "Execução",
      description:
        "Acesso ao módulo operacional de execução.",
      permissions: [
        "module.execution",
      ],
    },

  ];


function getApiUrl() {

  const api =
    process.env
      .NEXT_PUBLIC_API_URL;


  if (!api) {

    throw new Error(
      "NEXT_PUBLIC_API_URL não configurada."
    );

  }


  return api.replace(
    /\/$/,
    ""
  );

}


async function authorizedFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

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


  const raw =
    await response.text();


  let data: any =
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

    const message =
      data &&
      typeof data === "object" &&
      "message" in data

        ? Array.isArray(
            data.message
          )
            ? data.message.join(", ")
            : String(data.message)

        : `API_${response.status}`;


    throw new Error(
      message
    );

  }


  return data as T;

}


export default function AdminDelegatedPermissions() {

  const [
    users,
    setUsers,
  ] =
    useState<CompanyUser[]>([]);


  const [
    selectedUserId,
    setSelectedUserId,
  ] =
    useState("");


  const [
    payload,
    setPayload,
  ] =
    useState<
      PermissionPayload | null
    >(null);


  const [
    selectedPermissions,
    setSelectedPermissions,
  ] =
    useState<string[]>([]);


  const [
    loadingUsers,
    setLoadingUsers,
  ] =
    useState(true);


  const [
    loadingPermissions,
    setLoadingPermissions,
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


  const selectedUser =
    useMemo(
      () =>
        users.find(
          user =>
            user.id ===
              selectedUserId
        ) || null,
      [
        users,
        selectedUserId,
      ]
    );


  const availableKeys =
    useMemo(
      () =>
        new Set(
          (
            payload
              ?.availablePermissions ||
            []
          ).map(
            permission =>
              permission.key
          )
        ),
      [
        payload,
      ]
    );


  async function loadUsers() {

    try {

      setLoadingUsers(true);
      setError("");


      const data =
        await authorizedFetch<
          CompanyUser[]
        >(
          "/users"
        );


      const eligible =
        (
          Array.isArray(data)
            ? data
            : []
        ).filter(
          user =>
            !PROTECTED_ROLES.has(
              user.role
            )
        );


      setUsers(
        eligible
      );


      setSelectedUserId(
        current => {

          if (
            eligible.some(
              user =>
                user.id === current
            )
          ) {

            return current;

          }


          return (
            eligible[0]?.id ||
            ""
          );

        }
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );

    } finally {

      setLoadingUsers(false);

    }

  }


  async function loadPermissions(
    userId: string
  ) {

    if (!userId) {

      setPayload(null);

      setSelectedPermissions(
        []
      );

      return;

    }


    try {

      setLoadingPermissions(true);
      setError("");
      setSuccess("");


      const data =
        await authorizedFetch<
          PermissionPayload
        >(
          `/users/${encodeURIComponent(
            userId
          )}/role-permissions`
        );


      setPayload(
        data
      );


      setSelectedPermissions(
        Array.isArray(
          data.permissions
        )
          ? data.permissions
          : []
      );

    } catch (err) {

      setPayload(null);

      setSelectedPermissions(
        []
      );


      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );

    } finally {

      setLoadingPermissions(false);

    }

  }


  useEffect(
    () => {

      void loadUsers();

    },
    []
  );


  useEffect(
    () => {

      if (selectedUserId) {

        void loadPermissions(
          selectedUserId
        );

      } else {

        setPayload(null);

        setSelectedPermissions(
          []
        );

      }

    },
    [
      selectedUserId,
    ]
  );


  function isModuleAvailable(
    group: ModulePermissionGroup
  ) {

    return group.permissions.every(
      permission =>
        availableKeys.has(
          permission
        )
    );

  }


  function isModuleEnabled(
    group: ModulePermissionGroup
  ) {

    return group.permissions.every(
      permission =>
        selectedPermissions.includes(
          permission
        )
    );

  }


  function isModulePartial(
    group: ModulePermissionGroup
  ) {

    const count =
      group.permissions.filter(
        permission =>
          selectedPermissions.includes(
            permission
          )
      ).length;


    return (
      count > 0 &&
      count <
        group.permissions.length
    );

  }


  function toggleModule(
    group: ModulePermissionGroup
  ) {

    if (
      !isModuleAvailable(
        group
      )
    ) {

      return;

    }


    setError("");
    setSuccess("");


    setSelectedPermissions(
      current => {

        const enabled =
          group.permissions.every(
            permission =>
              current.includes(
                permission
              )
          );


        if (enabled) {

          return current.filter(
            permission =>
              !group.permissions.includes(
                permission
              )
          );

        }


        return Array.from(
          new Set([
            ...current,
            ...group.permissions,
          ])
        );

      }
    );

  }


  async function persist() {

    if (!selectedUserId) {
      return;
    }


    try {

      setSaving(true);
      setError("");
      setSuccess("");


      const data =
        await authorizedFetch<
          PermissionPayload
        >(
          `/users/${encodeURIComponent(
            selectedUserId
          )}/role-permissions`,
          {
            method: "PUT",

            body:
              JSON.stringify({
                permissions:
                  selectedPermissions,
              }),
          }
        );


      setPayload(
        data
      );


      setSelectedPermissions(
        data.permissions
      );


      setSuccess(
        "Permissões salvas com sucesso."
      );

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );

    } finally {

      setSaving(false);

    }

  }


  return (

    <div
      className="
        space-y-6
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Permissões
        </h1>


        <p
          className="
            mt-2
            text-slate-400
          "
        >
          Selecione os módulos que o
          usuário poderá acessar.
        </p>

      </div>


      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-800
            bg-red-950/40
            px-4
            py-3
            text-sm
            text-red-300
          "
        >
          {error}
        </div>

      )}


      {success && (

        <div
          className="
            rounded-xl
            border
            border-emerald-800
            bg-emerald-950/40
            px-4
            py-3
            text-sm
            text-emerald-300
          "
        >
          {success}
        </div>

      )}


      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-950
          p-5
        "
      >

        <label
          className="
            block
            text-sm
            font-medium
            text-slate-300
          "
        >
          Usuário
        </label>


        <select
          value={
            selectedUserId
          }
          onChange={
            event =>
              setSelectedUserId(
                event.target.value
              )
          }
          disabled={
            loadingUsers ||
            saving
          }
          className="
            mt-2
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-4
            py-3
            text-white
            outline-none
          "
        >

          {users.length === 0 && (

            <option value="">
              Nenhum usuário disponível
            </option>

          )}


          {users.map(
            user => (

              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
                {" — "}
                {user.role}
                {" — "}
                {user.email}
              </option>

            )
          )}

        </select>

      </div>


      {selectedUser && (

        <div
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-950
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
              Módulos disponíveis
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              Permissões de
              {" "}
              {selectedUser.name}
            </p>

          </div>


          <div
            className="
              mt-5
              grid
              gap-3
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {MODULE_PERMISSION_GROUPS.map(
              group => {

                const available =
                  isModuleAvailable(
                    group
                  );


                const enabled =
                  isModuleEnabled(
                    group
                  );


                const partial =
                  isModulePartial(
                    group
                  );


                return (

                  <label
                    key={
                      group.id
                    }
                    className={`
                      flex
                      min-h-28
                      items-start
                      gap-4
                      rounded-xl
                      border
                      p-4
                      transition
                      ${
                        available
                          ? "cursor-pointer border-slate-700 bg-slate-900/70 hover:border-cyan-600"
                          : "cursor-not-allowed border-slate-800 bg-slate-950 opacity-50"
                      }
                    `}
                  >

                    <input
                      type="checkbox"
                      checked={
                        enabled
                      }
                      disabled={
                        saving ||
                        loadingPermissions ||
                        !available
                      }
                      onChange={
                        () =>
                          toggleModule(
                            group
                          )
                      }
                      className="
                        mt-1
                      "
                    />


                    <span
                      className="
                        flex-1
                      "
                    >

                      <span
                        className="
                          block
                          text-base
                          font-semibold
                          text-white
                        "
                      >
                        {group.label}
                      </span>


                      <span
                        className="
                          mt-1
                          block
                          text-xs
                          leading-5
                          text-slate-400
                        "
                      >
                        {
                          group.description
                        }
                      </span>


                      <span
                        className={`
                          mt-3
                          inline-block
                          text-xs
                          font-semibold
                          ${
                            enabled
                              ? "text-emerald-400"
                              : partial
                                ? "text-amber-400"
                                : "text-slate-500"
                          }
                        `}
                      >
                        {
                          !available
                            ? "INDISPONÍVEL"
                            : enabled
                              ? "ATIVO"
                              : partial
                                ? "PARCIAL"
                                : "INATIVO"
                        }
                      </span>

                    </span>

                  </label>

                );

              }
            )}

          </div>


          <div
            className="
              mt-6
              flex
              justify-end
            "
          >

            <button
              type="button"
              disabled={
                saving ||
                loadingPermissions ||
                !selectedUserId
              }
              onClick={
                () =>
                  void persist()
              }
              className="
                rounded-xl
                bg-cyan-500
                px-6
                py-3
                text-sm
                font-semibold
                text-slate-950
                transition
                hover:bg-cyan-400
                disabled:opacity-50
              "
            >
              {
                saving
                  ? "Salvando..."
                  : "Salvar Permissões"
              }
            </button>

          </div>

        </div>

      )}


      {loadingPermissions && (

        <div
          className="
            text-sm
            text-slate-400
          "
        >
          Carregando permissões...
        </div>

      )}

    </div>

  );

}
