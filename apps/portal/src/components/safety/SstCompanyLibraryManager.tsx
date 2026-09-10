"use client";

/*
 * ETAPA35A17B_R1D_SST_COMPANY_MANAGER
 *
 * SST / PGR / PCMSO:
 * - CompanyFile
 * - ROOT/MASTER escolhem empresa
 * - ADMIN usa somente empresa da sessão
 * - sem novas permissões
 */

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Download,
  Eye,
  FileText,
  Trash2,
  Upload,
  X
} from "lucide-react";

import {
  AuthContext
} from "@/context/AuthContext";


const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "";

const CATEGORY =
  "SST / PGR / PCMSO";


const MONTHS = [

  {
    value:
      "01-janeiro",
    label:
      "Janeiro"
  },

  {
    value:
      "02-fevereiro",
    label:
      "Fevereiro"
  },

  {
    value:
      "03-marco",
    label:
      "Março"
  },

  {
    value:
      "04-abril",
    label:
      "Abril"
  },

  {
    value:
      "05-maio",
    label:
      "Maio"
  },

  {
    value:
      "06-junho",
    label:
      "Junho"
  },

  {
    value:
      "07-julho",
    label:
      "Julho"
  },

  {
    value:
      "08-agosto",
    label:
      "Agosto"
  },

  {
    value:
      "09-setembro",
    label:
      "Setembro"
  },

  {
    value:
      "10-outubro",
    label:
      "Outubro"
  },

  {
    value:
      "11-novembro",
    label:
      "Novembro"
  },

  {
    value:
      "12-dezembro",
    label:
      "Dezembro"
  }

];


type Company = {

  id: string;

  name: string;

  isActive?: boolean;

};


type SstFile = {

  id: string;

  name?: string;

  fileName?: string;

  category?: string;

  month?: string;

  year?:
    | string
    | number;

  size?: number;

  type?: string;

};


type Props = {

  companyId?: string;

  embedded?: boolean;

};


function authHeaders() {

  const token =
    localStorage.getItem(
      "token"
    );


  return {

    Authorization:
      `Bearer ${token}`

  };

}


function normalizePermissions(
  raw: unknown
) {

  if (!Array.isArray(raw)) {

    return [] as string[];

  }


  return raw
    .map(
      (
        permission:
          any
      ) => {

        if (
          typeof permission ===
          "string"
        ) {

          return permission;

        }


        return String(
          permission?.key ||
          permission?.permissionKey ||
          ""
        );

      }
    )
    .filter(Boolean);

}


function normalizeCompanies(
  data: any
): Company[] {

  const rows =
    Array.isArray(data)
      ? data
      : Array.isArray(
          data?.companies
        )
        ? data.companies
        : Array.isArray(
            data?.items
          )
          ? data.items
          : Array.isArray(
              data?.data
            )
            ? data.data
            : [];


  return rows
    .filter(
      (
        company:
          any
      ) =>
        Boolean(
          company?.id
        )
    )
    .map(
      (
        company:
          any
      ) => ({

        id:
          String(
            company.id
          ),

        name:
          String(
            company.name ||
            company.tradeName ||
            company.legalName ||
            company.id
          ),

        isActive:
          company.isActive

      })
    );

}


function normalizeFiles(
  data: any
): SstFile[] {

  if (
    Array.isArray(data)
  ) {

    return data;

  }


  if (
    Array.isArray(
      data?.files
    )
  ) {

    return data.files;

  }


  if (
    Array.isArray(
      data?.items
    )
  ) {

    return data.items;

  }


  if (
    Array.isArray(
      data?.data
    )
  ) {

    return data.data;

  }


  return [];

}


function formatBytes(
  size?: number
) {

  const value =
    Number(
      size || 0
    );


  if (!value) {

    return "-";

  }


  if (
    value <
    1024 * 1024
  ) {

    return (
      (
        value /
        1024
      ).toFixed(1) +
      " KB"
    );

  }


  return (
    (
      value /
      1024 /
      1024
    ).toFixed(2) +
    " MB"
  );

}


export default function SstCompanyLibraryManager({

  companyId,

  embedded = false

}: Props) {

  const {
    user
  } =
    useContext(
      AuthContext
    );


  const userAny =
    user as any;


  const role =
    String(
      userAny?.role ||
      ""
    )
      .toUpperCase();


  const isPlatformRole =
    role === "ROOT" ||
    role === "MASTER";


  const permissions =
    useMemo(
      () =>
        normalizePermissions(
          userAny?.permissions
        ),
      [
        userAny?.permissions
      ]
    );


  const canView =
    isPlatformRole ||
    (
      permissions.includes(
        "module.files"
      ) &&
      permissions.includes(
        "files.view"
      )
    );


  const canDownload =
    isPlatformRole ||
    (
      permissions.includes(
        "module.files"
      ) &&
      permissions.includes(
        "files.download"
      )
    );


  const canUpload =
    isPlatformRole;


  const canDelete =
    isPlatformRole;


  const ownCompanyId =
    String(
      userAny?.companyId ||
      ""
    );


  const ownCompanyName =
    String(
      userAny?.companyName ||
      userAny?.company?.name ||
      "Minha empresa"
    );


  const [
    companies,
    setCompanies
  ] =
    useState<Company[]>(
      []
    );


  const [
    selectedCompany,
    setSelectedCompany
  ] =
    useState("");


  const [
    month,
    setMonth
  ] =
    useState(
      MONTHS[
        new Date().getMonth()
      ]?.value ||
      "01-janeiro"
    );


  const [
    files,
    setFiles
  ] =
    useState<SstFile[]>(
      []
    );


  const [
    selectedFiles,
    setSelectedFiles
  ] =
    useState<File[]>(
      []
    );


  const [
    loadingCompanies,
    setLoadingCompanies
  ] =
    useState(false);


  const [
    loadingFiles,
    setLoadingFiles
  ] =
    useState(false);


  const [
    uploading,
    setUploading
  ] =
    useState(false);


  const [
    error,
    setError
  ] =
    useState("");


  const [
    previewUrl,
    setPreviewUrl
  ] =
    useState("");


  const [
    previewName,
    setPreviewName
  ] =
    useState("");


  const loadFiles =
    useCallback(

      async (
        targetCompanyId:
          string
      ) => {

        if (
          !canView ||
          !targetCompanyId
        ) {

          setFiles([]);

          return;

        }


        setLoadingFiles(
          true
        );

        setError("");


        try {

          const url =
            API +
            "/company-files/" +
            encodeURIComponent(
              targetCompanyId
            ) +
            "?category=" +
            encodeURIComponent(
              CATEGORY
            );


          const response =
            await fetch(

              url,

              {

                headers:
                  authHeaders(),

                cache:
                  "no-store"

              }

            );


          const data =
            await response
              .json()
              .catch(
                () =>
                  null
              );


          if (!response.ok) {

            throw new Error(
              data?.message ||
              `FILES_HTTP_${response.status}`
            );

          }


          setFiles(
            normalizeFiles(
              data
            )
          );


        } catch (
          err:
            any
        ) {

          setFiles([]);

          setError(
            err?.message ||
            "Erro ao carregar documentos."
          );

        } finally {

          setLoadingFiles(
            false
          );

        }

      },

      [
        canView
      ]

    );


  /*
   * Resolver empresa.
   *
   * ROOT / MASTER:
   * consulta empresas reais.
   *
   * ADMIN:
   * nunca chama /admin/companies.
   */
  useEffect(
    () => {

      let cancelled =
        false;


      async function init() {

        setError("");


        if (!canView) {

          setCompanies([]);
          setSelectedCompany("");
          setFiles([]);

          return;

        }


        if (
          !isPlatformRole
        ) {

          if (!ownCompanyId) {

            setCompanies([]);
            setSelectedCompany("");
            setFiles([]);

            setError(
              "Usuário sem empresa vinculada."
            );

            return;

          }


          const own = [

            {

              id:
                ownCompanyId,

              name:
                ownCompanyName

            }

          ];


          if (!cancelled) {

            setCompanies(
              own
            );

            setSelectedCompany(
              ownCompanyId
            );

          }


          return;

        }


        setLoadingCompanies(
          true
        );


        try {

          const response =
            await fetch(

              API +
              "/admin/companies",

              {

                headers:
                  authHeaders(),

                cache:
                  "no-store"

              }

            );


          const data =
            await response
              .json()
              .catch(
                () =>
                  null
              );


          if (!response.ok) {

            throw new Error(
              data?.message ||
              `COMPANIES_HTTP_${response.status}`
            );

          }


          const rows =
            normalizeCompanies(
              data
            )
              .filter(
                company =>
                  company.isActive !==
                  false
              );


          if (cancelled) {

            return;

          }


          setCompanies(
            rows
          );


          /*
           * No dashboard da própria
           * empresa, pré-seleciona o
           * tenant da rota.
           *
           * Em /seg/pgr companyId não
           * é informado: seleção fica
           * vazia.
           */
          const forcedCompanyId =
            String(
              companyId ||
              ""
            );


          const forcedExists =
            forcedCompanyId &&
            rows.some(
              company =>
                company.id ===
                forcedCompanyId
            );


          if (forcedExists) {

            setSelectedCompany(
              forcedCompanyId
            );

          } else {

            setSelectedCompany("");

            setFiles([]);

          }


        } catch (
          err:
            any
        ) {

          if (!cancelled) {

            setCompanies([]);
            setSelectedCompany("");
            setFiles([]);

            setError(
              err?.message ||
              "Erro ao carregar empresas."
            );

          }


        } finally {

          if (!cancelled) {

            setLoadingCompanies(
              false
            );

          }

        }

      }


      void init();


      return () => {

        cancelled =
          true;

      };

    },

    [
      canView,
      isPlatformRole,
      ownCompanyId,
      ownCompanyName,
      companyId
    ]

  );


  useEffect(
    () => {

      if (
        !selectedCompany
      ) {

        setFiles([]);

        return;

      }


      void loadFiles(
        selectedCompany
      );

    },

    [
      selectedCompany,
      loadFiles
    ]

  );


  async function upload() {

    if (!canUpload) {

      return;

    }


    if (!selectedCompany) {

      alert(
        "Selecione a empresa."
      );

      return;

    }


    if (
      selectedFiles.length ===
      0
    ) {

      alert(
        "Selecione pelo menos um arquivo."
      );

      return;

    }


    const confirmed =
      window.confirm(
        `Publicar ${selectedFiles.length} arquivo(s) em ${CATEGORY}?`
      );


    if (!confirmed) {

      return;

    }


    setUploading(
      true
    );

    setError("");


    try {

      const form =
        new FormData();


      for (
        const file
        of selectedFiles
      ) {

        form.append(
          "files",
          file
        );

      }


      form.append(
        "companyId",
        selectedCompany
      );


      form.append(
        "category",
        CATEGORY
      );


      form.append(
        "month",
        month
      );


      form.append(
        "year",
        String(
          new Date()
            .getFullYear()
        )
      );


      const response =
        await fetch(

          API +
          "/upload",

          {

            method:
              "POST",

            headers:
              authHeaders(),

            body:
              form

          }

        );


      const data =
        await response
          .json()
          .catch(
            () =>
              null
          );


      if (!response.ok) {

        throw new Error(
          data?.message ||
          `UPLOAD_HTTP_${response.status}`
        );

      }


      setSelectedFiles(
        []
      );


      await loadFiles(
        selectedCompany
      );


      alert(
        "Upload concluído."
      );


    } catch (
      err:
        any
    ) {

      setError(
        err?.message ||
        "Erro no upload."
      );

      alert(
        err?.message ||
        "Erro no upload."
      );


    } finally {

      setUploading(
        false
      );

    }

  }


  async function removeFile(
    file:
      SstFile
  ) {

    if (
      !canDelete ||
      !file.id
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        `Excluir "${file.name || file.fileName || "arquivo"}"?`
      );


    if (!confirmed) {

      return;

    }


    setError("");


    try {

      const response =
        await fetch(

          API +
          "/company-files/" +
          encodeURIComponent(
            file.id
          ),

          {

            method:
              "DELETE",

            headers:
              authHeaders()

          }

        );


      const data =
        await response
          .json()
          .catch(
            () =>
              null
          );


      if (!response.ok) {

        throw new Error(
          data?.message ||
          `DELETE_HTTP_${response.status}`
        );

      }


      await loadFiles(
        selectedCompany
      );


    } catch (
      err:
        any
    ) {

      setError(
        err?.message ||
        "Erro ao excluir documento."
      );

      alert(
        err?.message ||
        "Erro ao excluir documento."
      );

    }

  }


  async function previewFile(
    file:
      SstFile
  ) {

    if (
      !canView ||
      !file.id
    ) {

      return;

    }


    setError("");


    try {

      const response =
        await fetch(

          API +
          "/company-files/view/" +
          encodeURIComponent(
            file.id
          ),

          {

            headers:
              authHeaders(),

            cache:
              "no-store"

          }

        );


      if (!response.ok) {

        throw new Error(
          `VIEW_HTTP_${response.status}`
        );

      }


      const blob =
        await response.blob();


      const url =
        URL.createObjectURL(
          blob
        );


      if (previewUrl) {

        URL.revokeObjectURL(
          previewUrl
        );

      }


      setPreviewUrl(
        url
      );


      setPreviewName(
        file.name ||
        file.fileName ||
        "Documento"
      );


    } catch (
      err:
        any
    ) {

      setError(
        err?.message ||
        "Erro ao visualizar documento."
      );

    }

  }


  function closePreview() {

    if (previewUrl) {

      URL.revokeObjectURL(
        previewUrl
      );

    }


    setPreviewUrl("");

    setPreviewName("");

  }


  async function downloadFile(
    file:
      SstFile
  ) {

    if (
      !canDownload ||
      !file.id
    ) {

      return;

    }


    setError("");


    try {

      const response =
        await fetch(

          API +
          "/company-files/download/" +
          encodeURIComponent(
            file.id
          ),

          {

            headers:
              authHeaders()

          }

        );


      if (!response.ok) {

        throw new Error(
          `DOWNLOAD_HTTP_${response.status}`
        );

      }


      const blob =
        await response.blob();


      const url =
        URL.createObjectURL(
          blob
        );


      const anchor =
        document.createElement(
          "a"
        );


      anchor.href =
        url;


      anchor.download =
        file.name ||
        file.fileName ||
        "documento";


      document.body.appendChild(
        anchor
      );


      anchor.click();

      anchor.remove();


      URL.revokeObjectURL(
        url
      );


    } catch (
      err:
        any
    ) {

      setError(
        err?.message ||
        "Erro no download."
      );

    }

  }


  const selectedCompanyName =
    companies.find(
      company =>
        company.id ===
        selectedCompany
    )?.name ||
    (
      isPlatformRole
        ? ""
        : ownCompanyName
    );


  if (!canView) {

    return (

      <div
        className="
          rounded-xl
          border
          border-amber-700/50
          bg-amber-950/20
          p-5
          text-amber-200
        "
      >

        Você não possui as permissões
        necessárias para visualizar
        documentos SST.

      </div>

    );

  }


  return (

    <div
      className={
        embedded
          ? "space-y-6"
          : "space-y-8"
      }
    >

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <div
          className="
            grid
            grid-cols-1
            gap-4
            lg:grid-cols-4
          "
        >

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Empresa *
            </label>


            {isPlatformRole ? (

              <select
                value={
                  selectedCompany
                }
                onChange={
                  event => {

                    setSelectedCompany(
                      event.target.value
                    );

                  }
                }
                disabled={
                  loadingCompanies
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  text-slate-100
                "
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
                    </option>

                  )
                )}

              </select>

            ) : (

              <div
                className="
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-4
                  py-3
                  text-slate-200
                "
              >
                {selectedCompanyName}
              </div>

            )}

          </div>


          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Mês
            </label>


            <select
              value={
                month
              }
              onChange={
                event =>
                  setMonth(
                    event.target.value
                  )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-slate-100
              "
            >

              {MONTHS.map(
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
              )}

            </select>

          </div>


          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Categoria
            </label>


            <div
              className="
                rounded-xl
                border
                border-slate-700
                bg-slate-950
                px-4
                py-3
                text-slate-200
              "
            >
              {CATEGORY}
            </div>

          </div>


          {canUpload && (

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-300
                "
              >
                Arquivos
              </label>


              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={
                  event => {

                    setSelectedFiles(
                      Array.from(
                        event.target.files ||
                        []
                      )
                    );

                  }
                }
                className="
                  block
                  w-full
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-950
                  px-3
                  py-2
                  text-sm
                  text-slate-200
                "
              />

            </div>

          )}

        </div>


        {canUpload &&
          selectedFiles.length >
            0 && (

          <div
            className="
              mt-5
              space-y-2
              rounded-xl
              border
              border-slate-800
              bg-slate-950
              p-4
            "
          >

            <div
              className="
                text-sm
                font-semibold
                text-slate-300
              "
            >
              Arquivos selecionados
            </div>


            {selectedFiles.map(
              (
                file,
                index
              ) => (

                <div
                  key={
                    file.name +
                    index
                  }
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    bg-slate-900
                    px-3
                    py-2
                  "
                >

                  <span
                    className="
                      min-w-0
                      truncate
                      text-sm
                      text-slate-300
                    "
                  >
                    {file.name}
                  </span>


                  <button
                    type="button"
                    onClick={
                      () =>
                        setSelectedFiles(
                          previous =>
                            previous.filter(
                              (
                                _,
                                fileIndex
                              ) =>
                                fileIndex !==
                                index
                            )
                        )
                    }
                    className="
                      rounded-lg
                      p-2
                      text-red-400
                      hover:bg-red-950/40
                    "
                    title="Remover da seleção"
                  >
                    <X
                      size={
                        18
                      }
                    />
                  </button>

                </div>

              )
            )}

          </div>

        )}


        {canUpload && (

          <div className="mt-5">

            <button
              type="button"
              disabled={
                uploading ||
                !selectedCompany ||
                selectedFiles.length ===
                  0
              }
              onClick={
                upload
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-cyan-500
                px-6
                py-3
                font-bold
                text-slate-950
                transition
                hover:bg-cyan-400
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Upload
                size={
                  18
                }
              />

              {uploading
                ? "Enviando..."
                : "Upload"}

            </button>

          </div>

        )}

      </div>


      {error && (

        <div
          className="
            rounded-xl
            border
            border-red-800
            bg-red-950/30
            p-4
            text-sm
            text-red-300
          "
        >
          {error}
        </div>

      )}


      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-b
            border-slate-800
            p-5
          "
        >

          <div>

            <h3
              className="
                text-lg
                font-bold
                text-slate-100
              "
            >
              Documentos SST
            </h3>


            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >
              {selectedCompany
                ? (
                    selectedCompanyName ||
                    "Empresa selecionada"
                  )
                : "Selecione uma empresa"}
            </p>

          </div>


          {loadingFiles && (

            <span
              className="
                text-sm
                text-cyan-300
              "
            >
              Carregando...
            </span>

          )}

        </div>


        {!selectedCompany ? (

          <div
            className="
              p-8
              text-center
              text-slate-400
            "
          >
            Selecione uma empresa para
            visualizar os documentos.
          </div>

        ) : files.length === 0 &&
          !loadingFiles ? (

          <div
            className="
              p-8
              text-center
              text-slate-400
            "
          >
            Nenhum documento SST
            disponível para esta empresa.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table
              className="
                w-full
                min-w-[850px]
              "
            >

              <thead
                className="
                  bg-slate-950
                  text-left
                  text-xs
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >

                <tr>

                  <th className="px-5 py-4">
                    Arquivo
                  </th>

                  <th className="px-5 py-4">
                    Categoria
                  </th>

                  <th className="px-5 py-4">
                    Mês
                  </th>

                  <th className="px-5 py-4">
                    Ano
                  </th>

                  <th className="px-5 py-4">
                    Tamanho
                  </th>

                  <th className="px-5 py-4">
                    Ações
                  </th>

                </tr>

              </thead>


              <tbody
                className="
                  divide-y
                  divide-slate-800
                "
              >

                {files.map(
                  file => (

                    <tr
                      key={
                        file.id
                      }
                      className="
                        text-sm
                        text-slate-300
                      "
                    >

                      <td className="px-5 py-4">

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          <FileText
                            size={
                              18
                            }
                            className="shrink-0 text-cyan-400"
                          />

                          <span
                            className="
                              max-w-[340px]
                              truncate
                            "
                          >
                            {file.name ||
                             file.fileName ||
                             "-"}
                          </span>

                        </div>

                      </td>


                      <td className="px-5 py-4">
                        {file.category ||
                         CATEGORY}
                      </td>


                      <td className="px-5 py-4">
                        {file.month ||
                         "-"}
                      </td>


                      <td className="px-5 py-4">
                        {file.year ||
                         "-"}
                      </td>


                      <td className="px-5 py-4">
                        {formatBytes(
                          file.size
                        )}
                      </td>


                      <td className="px-5 py-4">

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <button
                            type="button"
                            onClick={
                              () =>
                                previewFile(
                                  file
                                )
                            }
                            className="
                              rounded-lg
                              border
                              border-slate-700
                              p-2
                              text-cyan-300
                              hover:bg-slate-800
                            "
                            title="Visualizar"
                          >
                            <Eye
                              size={
                                17
                              }
                            />
                          </button>


                          {canDownload && (

                            <button
                              type="button"
                              onClick={
                                () =>
                                  downloadFile(
                                    file
                                  )
                              }
                              className="
                                rounded-lg
                                border
                                border-slate-700
                                p-2
                                text-emerald-300
                                hover:bg-slate-800
                              "
                              title="Download"
                            >
                              <Download
                                size={
                                  17
                                }
                              />
                            </button>

                          )}


                          {canDelete && (

                            <button
                              type="button"
                              onClick={
                                () =>
                                  removeFile(
                                    file
                                  )
                              }
                              className="
                                rounded-lg
                                border
                                border-red-900
                                p-2
                                text-red-400
                                hover:bg-red-950/40
                              "
                              title="Excluir"
                            >
                              <Trash2
                                size={
                                  17
                                }
                              />
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {previewUrl && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/80
            p-4
          "
        >

          <div
            className="
              flex
              h-[92vh]
              w-full
              max-w-6xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-700
              bg-slate-950
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-slate-800
                px-5
                py-4
              "
            >

              <div
                className="
                  min-w-0
                  truncate
                  font-semibold
                  text-slate-100
                "
              >
                {previewName}
              </div>


              <button
                type="button"
                onClick={
                  closePreview
                }
                className="
                  rounded-lg
                  p-2
                  text-slate-300
                  hover:bg-slate-800
                "
              >
                <X
                  size={
                    22
                  }
                />
              </button>

            </div>


            <iframe
              src={
                previewUrl
              }
              title={
                previewName
              }
              className="
                h-full
                w-full
                bg-white
              "
            />

          </div>

        </div>

      )}

    </div>

  );

}
