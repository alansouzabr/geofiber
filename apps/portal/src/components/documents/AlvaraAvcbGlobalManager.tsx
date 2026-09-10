"use client";

/*
 * ETAPA35A15C_R1_COMPANY_SCOPED_ALVARA
 *
 * Alvará / AVCB vinculado à empresa.
 *
 * ROOT / MASTER:
 *
 *   1. seleciona empresa;
 *   2. publica documento via /upload;
 *   3. arquivo é persistido como CompanyFile;
 *   4. consulta arquivos da empresa selecionada.
 *
 * ADMIN:
 *
 *   1. não escolhe empresa;
 *   2. não possui upload;
 *   3. utiliza a empresa da sessão/rota;
 *   4. backend força req.user.companyId.
 *
 * Categoria:
 *
 *   ALVARA_AVCB
 *
 * Storage:
 *
 *   CompanyFile
 *
 * O código GlobalLibrary criado na etapa anterior
 * permanece no backend por segurança de rollback,
 * porém não é mais utilizado por este frontend.
 */

import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Building2,
  Download,
  Eye,
  FileCheck2,
  FileText,
  RefreshCw,
  Upload,
  X
} from "lucide-react";

import {
  AuthContext
} from "@/context/AuthContext";


const API =
  (
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.geofibers.com.br"
  ).replace(
    /\/+$/,
    ""
  );


const CATEGORY =
  "ALVARA_AVCB";


type Props = {

  mode:
    | "platform"
    | "company";

  companyId?: string;

};


type Company = {

  id: string;

  name?: string | null;

  razaoSocial?: string | null;

  cnpj?: string | null;

  isActive?: boolean;

};


type CompanyDocument = {

  id: string;

  companyId?: string;

  name: string;

  fileName?: string;

  category?: string | null;

  month?: string | null;

  year?: string | null;

  type?: string | null;

  size?: number | null;

  uploadedBy?: string | null;

  createdAt?: string;

  updatedAt?: string;

};


type PreviewState = {

  name: string;

  url: string;

} | null;


function bytesToSize(
  value?: number | null
) {

  const bytes =
    Number(
      value || 0
    );


  if (!bytes) {

    return "-";

  }


  if (
    bytes < 1024
  ) {

    return `${bytes} B`;

  }


  if (
    bytes <
    1024 * 1024
  ) {

    return `${
      (
        bytes /
        1024
      ).toFixed(1)
    } KB`;

  }


  return `${
    (
      bytes /
      1024 /
      1024
    ).toFixed(2)
  } MB`;

}


function formatDate(
  value?: string
) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(
      value
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  return date.toLocaleString(
    "pt-BR"
  );

}


function companyLabel(
  company: Company
) {

  const main =
    company.name ||
    company.razaoSocial ||
    company.cnpj ||
    company.id;


  if (
    company.cnpj &&
    main !== company.cnpj
  ) {

    return `${
      main
    } — ${
      company.cnpj
    }`;

  }


  return main;

}


export default function AlvaraAvcbGlobalManager({

  mode,

  companyId

}: Props) {


  const auth =
    useContext(
      AuthContext
    );


  /*
   * Evita dependência de detalhes adicionais
   * da tipagem do AuthContext.
   */
  const user =
    (
      auth?.user ??
      null
    ) as any;


  const role =
    String(
      user?.role ||
      ""
    ).toUpperCase();


  const permissions:
    string[] =
      Array.isArray(
        user?.permissions
      )

        ? user.permissions

        : [];


  const platformRole =
    role === "ROOT" ||
    role === "MASTER";


  const hasFilesModule =
    permissions.includes(
      "module.files"
    );


  const canView =
    platformRole ||
    (
      hasFilesModule &&
      permissions.includes(
        "files.view"
      )
    );


  const canDownload =
    platformRole ||
    (
      hasFilesModule &&
      permissions.includes(
        "files.download"
      )
    );


  const canUpload =
    mode === "platform" &&
    platformRole;


  const sessionCompanyId =
    String(
      user?.companyId ||
      ""
    );


  const [
    companies,
    setCompanies
  ] =
    useState<Company[]>([]);


  const [
    selectedCompanyId,
    setSelectedCompanyId
  ] =
    useState("");


  const [
    companiesLoading,
    setCompaniesLoading
  ] =
    useState(false);


  const [
    documents,
    setDocuments
  ] =
    useState<CompanyDocument[]>(
      []
    );


  const [
    selectedFiles,
    setSelectedFiles
  ] =
    useState<File[]>([]);


  const [
    fileInputKey,
    setFileInputKey
  ] =
    useState(0);


  const [
    loading,
    setLoading
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
    success,
    setSuccess
  ] =
    useState("");


  const [
    preview,
    setPreview
  ] =
    useState<PreviewState>(
      null
    );


  /*
   * PLATFORM:
   * empresa escolhida manualmente.
   *
   * ADMIN:
   * preferência absoluta para companyId
   * presente na sessão.
   *
   * companyId da rota é fallback visual.
   *
   * O backend continua sendo a autoridade
   * de isolamento tenant.
   */
  const effectiveCompanyId =
    mode === "platform"

      ? selectedCompanyId

      : (
          sessionCompanyId ||
          String(
            companyId ||
            ""
          )
        );


  const selectedCompany =
    useMemo(
      () => {

        return (
          companies.find(
            company =>
              company.id ===
              selectedCompanyId
          ) ||
          null
        );

      },
      [
        companies,
        selectedCompanyId
      ]
    );


  const selectedCompanyName =
    selectedCompany

      ? companyLabel(
          selectedCompany
        )

      : "";


  const sortedDocuments =
    useMemo(
      () => {

        return [
          ...documents
        ].sort(
          (
            a,
            b
          ) => {

            const aTime =
              a.createdAt

                ? new Date(
                    a.createdAt
                  ).getTime()

                : 0;


            const bTime =
              b.createdAt

                ? new Date(
                    b.createdAt
                  ).getTime()

                : 0;


            return (
              bTime -
              aTime
            );

          }
        );

      },
      [
        documents
      ]
    );


  function token() {

    if (
      typeof window ===
      "undefined"
    ) {

      return "";

    }


    return (
      localStorage.getItem(
        "token"
      ) ||
      ""
    );

  }


  async function apiFetch(

    path: string,

    init:
      RequestInit = {}

  ) {


    const headers =
      new Headers(
        init.headers ||
        {}
      );


    const authToken =
      token();


    if (
      authToken
    ) {

      headers.set(
        "Authorization",
        `Bearer ${authToken}`
      );

    }


    return fetch(

      `${API}${path}`,

      {

        ...init,

        headers,

        cache:
          "no-store"

      }

    );

  }


  async function loadCompanies() {


    if (
      mode !== "platform" ||
      !platformRole
    ) {

      return;

    }


    try {


      setCompaniesLoading(
        true
      );

      setError("");


      const response =
        await apiFetch(
          "/admin/companies"
        );


      const body =
        await response
          .json()
          .catch(
            () => null
          );


      if (
        !response.ok
      ) {

        throw new Error(
          body?.message ||
          `Falha ao carregar empresas (${response.status}).`
        );

      }


      /*
       * /admin/companies é utilizado pelo
       * DocumentsManager existente.
       *
       * Aceitamos tanto array direto quanto
       * { companies: [...] } para preservar
       * compatibilidade.
       */
      const source =
        Array.isArray(
          body
        )

          ? body

          : (
              Array.isArray(
                body?.companies
              )

                ? body.companies

                : []
            );


      const normalized:
        Company[] =
          source
            .filter(
              (
                company: any
              ) =>
                Boolean(
                  company?.id
                )
            )
            .map(
              (
                company: any
              ) => ({

                id:
                  String(
                    company.id
                  ),

                name:
                  company.name ??
                  null,

                razaoSocial:
                  company.razaoSocial ??
                  null,

                cnpj:
                  company.cnpj ??
                  null,

                isActive:
                  company.isActive

              })
            )
            .sort(
              (
                a,
                b
              ) =>
                companyLabel(a)
                  .localeCompare(
                    companyLabel(b),
                    "pt-BR"
                  )
            );


      setCompanies(
        normalized
      );


    } catch (
      err: any
    ) {


      console.error(
        "ALVARA_AVCB_COMPANIES_ERROR",
        err
      );


      setCompanies([]);


      setError(
        err?.message ||
        "Não foi possível carregar as empresas."
      );


    } finally {


      setCompaniesLoading(
        false
      );


    }

  }


  async function loadDocuments(
    targetCompanyId:
      string
  ) {


    if (
      !canView
    ) {

      setDocuments([]);

      return;

    }


    if (
      !targetCompanyId
    ) {

      setDocuments([]);

      return;

    }


    try {


      setLoading(
        true
      );

      setError("");


      const params =
        new URLSearchParams();


      params.set(
        "category",
        CATEGORY
      );


      const response =
        await apiFetch(

          `/company-files/${
            encodeURIComponent(
              targetCompanyId
            )
          }?${
            params.toString()
          }`

        );


      const body =
        await response
          .json()
          .catch(
            () => null
          );


      if (
        !response.ok
      ) {

        throw new Error(
          body?.message ||
          `Falha ao carregar documentos (${response.status}).`
        );

      }


      setDocuments(
        Array.isArray(
          body
        )

          ? body

          : []
      );


    } catch (
      err: any
    ) {


      console.error(
        "ALVARA_AVCB_DOCUMENTS_ERROR",
        err
      );


      setDocuments([]);


      setError(
        err?.message ||
        "Não foi possível carregar Alvará / AVCB."
      );


    } finally {


      setLoading(
        false
      );


    }

  }


  useEffect(
    () => {

      void loadCompanies();

    },
    [
      mode,
      platformRole
    ]
  );


  useEffect(
    () => {


      setSelectedFiles([]);

      setSuccess("");


      if (
        effectiveCompanyId
      ) {

        void loadDocuments(
          effectiveCompanyId
        );

      } else {

        setDocuments([]);

      }


    },
    [
      effectiveCompanyId,
      canView
    ]
  );


  useEffect(
    () => {

      return () => {

        if (
          preview?.url
        ) {

          URL.revokeObjectURL(
            preview.url
          );

        }

      };

    },
    [
      preview
    ]
  );


  async function uploadDocuments() {


    if (
      !canUpload
    ) {

      return;

    }


    if (
      !selectedCompanyId
    ) {

      setError(
        "Selecione a empresa antes de publicar."
      );

      return;

    }


    if (
      selectedFiles.length ===
      0
    ) {

      setError(
        "Selecione pelo menos um arquivo."
      );

      return;

    }


    try {


      setUploading(
        true
      );

      setError("");

      setSuccess("");


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
        selectedCompanyId
      );


      form.append(
        "category",
        CATEGORY
      );


      const now =
        new Date();


      form.append(
        "month",
        String(
          now.getMonth() + 1
        ).padStart(
          2,
          "0"
        )
      );


      form.append(
        "year",
        String(
          now.getFullYear()
        )
      );


      const response =
        await apiFetch(

          "/upload",

          {

            method:
              "POST",

            body:
              form

          }

        );


      const body =
        await response
          .json()
          .catch(
            () => null
          );


      if (
        !response.ok
      ) {

        throw new Error(
          body?.message ||
          `Falha no upload (${response.status}).`
        );

      }


      setSelectedFiles(
        []
      );


      setFileInputKey(
        current =>
          current + 1
      );


      setSuccess(
        `Documento publicado para ${
          selectedCompanyName ||
          "a empresa selecionada"
        }.`
      );


      await loadDocuments(
        selectedCompanyId
      );


    } catch (
      err: any
    ) {


      console.error(
        "ALVARA_AVCB_UPLOAD_ERROR",
        err
      );


      setError(
        err?.message ||
        "Não foi possível publicar o documento."
      );


    } finally {


      setUploading(
        false
      );


    }

  }


  async function previewDocument(
    document:
      CompanyDocument
  ) {


    if (
      !canView
    ) {

      return;

    }


    try {


      setError("");


      const response =
        await apiFetch(

          `/company-files/view/${
            encodeURIComponent(
              document.id
            )
          }`

        );


      if (
        !response.ok
      ) {

        throw new Error(
          `Não foi possível visualizar o arquivo (${response.status}).`
        );

      }


      const blob =
        await response.blob();


      if (
        blob.size <= 0
      ) {

        throw new Error(
          "Arquivo vazio."
        );

      }


      const objectUrl =
        URL.createObjectURL(
          blob
        );


      setPreview(
        current => {


          if (
            current?.url
          ) {

            URL.revokeObjectURL(
              current.url
            );

          }


          return {

            name:
              document.name,

            url:
              objectUrl

          };

        }
      );


    } catch (
      err: any
    ) {


      console.error(
        "ALVARA_AVCB_PREVIEW_ERROR",
        err
      );


      setError(
        err?.message ||
        "Não foi possível visualizar o documento."
      );


    }

  }


  async function downloadDocument(
    document:
      CompanyDocument
  ) {


    if (
      !canDownload
    ) {

      return;

    }


    try {


      setError("");


      const response =
        await apiFetch(

          `/company-files/download/${
            encodeURIComponent(
              document.id
            )
          }`

        );


      if (
        !response.ok
      ) {

        throw new Error(
          `Não foi possível baixar o arquivo (${response.status}).`
        );

      }


      const blob =
        await response.blob();


      const objectUrl =
        URL.createObjectURL(
          blob
        );


      const anchor =
        window.document
          .createElement(
            "a"
          );


      anchor.href =
        objectUrl;


      anchor.download =
        document.name ||
        document.fileName ||
        "alvara-avcb";


      window.document.body
        .appendChild(
          anchor
        );


      anchor.click();

      anchor.remove();


      URL.revokeObjectURL(
        objectUrl
      );


    } catch (
      err: any
    ) {


      console.error(
        "ALVARA_AVCB_DOWNLOAD_ERROR",
        err
      );


      setError(
        err?.message ||
        "Não foi possível baixar o documento."
      );


    }

  }


  if (
    mode === "platform" &&
    !platformRole
  ) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-red-900/60
          bg-red-950/20
          p-6
        "
      >

        <h1
          className="
            text-xl
            font-bold
            text-red-300
          "
        >
          Acesso restrito
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-400
          "
        >
          O gerenciamento de
          Alvará / AVCB é exclusivo
          de ROOT e MASTER.
        </p>

      </div>

    );

  }


  if (
    mode === "company" &&
    !canView
  ) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-900
          p-6
        "
      >

        <h1
          className="
            text-xl
            font-bold
            text-white
          "
        >
          Alvará / AVCB
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-400
          "
        >
          Seu perfil não possui permissão
          para visualizar estes documentos.
        </p>

      </div>

    );

  }


  return (

    <div
      className="
        space-y-6
      "
    >


      <header
        className="
          flex
          flex-col
          gap-4
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >


        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-cyan-500/10
              text-cyan-400
            "
          >

            <FileCheck2
              size={24}
            />

          </div>


          <div>

            <h1
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              Alvará / AVCB
            </h1>


            <p
              className="
                mt-1
                text-sm
                text-slate-400
              "
            >

              {
                mode === "platform"

                  ? "Publicação de documentos vinculados a uma empresa específica."

                  : "Documentos oficiais vinculados à sua empresa."
              }

            </p>

          </div>

        </div>


        <button

          type="button"

          onClick={() => {

            if (
              effectiveCompanyId
            ) {

              void loadDocuments(
                effectiveCompanyId
              );

            }

          }}

          disabled={
            loading ||
            !effectiveCompanyId
          }

          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-4
            py-2.5
            text-sm
            font-semibold
            text-slate-300
            transition
            hover:bg-slate-800
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >

          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Atualizar

        </button>


      </header>


      {
        canUpload &&
        (

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
                items-center
                gap-2
              "
            >

              <Upload
                size={18}
                className="
                  text-cyan-400
                "
              />

              <h2
                className="
                  font-semibold
                  text-white
                "
              >
                Publicar Alvará / AVCB
              </h2>

            </div>


            <p
              className="
                mt-2
                text-sm
                text-slate-400
              "
            >
              Escolha a empresa destinatária.
              O documento ficará disponível
              somente para essa empresa.
            </p>


            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-4
                xl:grid-cols-[minmax(280px,0.9fr)_minmax(360px,1.8fr)_auto]
                xl:items-end
              "
            >


              <label
                className="
                  block
                "
              >

                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Empresa *
                </span>


                <div
                  className="
                    relative
                  "
                >

                  <Building2
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-500
                    "
                  />


                  <select

                    value={
                      selectedCompanyId
                    }

                    onChange={
                      event => {

                        setSelectedCompanyId(
                          event.target.value
                        );

                        setSelectedFiles(
                          []
                        );

                        setError("");

                        setSuccess("");

                      }
                    }

                    disabled={
                      companiesLoading ||
                      uploading
                    }

                    className="
                      h-[50px]
                      w-full
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-950
                      pl-10
                      pr-4
                      text-sm
                      text-slate-200
                      outline-none
                      transition
                      focus:border-cyan-500
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <option value="">

                      {
                        companiesLoading

                          ? "Carregando empresas..."

                          : "Selecione a empresa"
                      }

                    </option>


                    {
                      companies.map(
                        company => (

                          <option
                            key={
                              company.id
                            }
                            value={
                              company.id
                            }
                          >
                            {
                              companyLabel(
                                company
                              )
                            }
                          </option>

                        )
                      )
                    }

                  </select>

                </div>

              </label>


              <label
                className="
                  block
                "
              >

                <span
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-slate-300
                  "
                >
                  Arquivos
                </span>


                <input

                  key={
                    fileInputKey
                  }

                  type="file"

                  multiple

                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"

                  disabled={
                    !selectedCompanyId ||
                    uploading
                  }

                  onChange={
                    event => {

                      setSelectedFiles(
                        Array.from(
                          event.target.files ||
                          []
                        )
                      );

                      setError("");

                      setSuccess("");

                    }
                  }

                  className="
                    block
                    h-[50px]
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-slate-950
                    px-3
                    py-2
                    text-sm
                    text-slate-300
                    file:mr-4
                    file:rounded-lg
                    file:border-0
                    file:bg-cyan-500
                    file:px-4
                    file:py-2
                    file:font-semibold
                    file:text-slate-950
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                />

              </label>


              <button

                type="button"

                onClick={
                  uploadDocuments
                }

                disabled={
                  uploading ||
                  !selectedCompanyId ||
                  selectedFiles.length === 0
                }

                className="
                  inline-flex
                  h-[50px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-cyan-500
                  px-6
                  font-bold
                  text-slate-950
                  transition
                  hover:bg-cyan-400
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                <Upload
                  size={17}
                />

                {
                  uploading
                    ? "Publicando..."
                    : "Publicar"
                }

              </button>


            </div>


            {
              selectedCompanyId &&
              (

                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-cyan-900/40
                    bg-cyan-950/10
                    px-4
                    py-3
                    text-sm
                    text-slate-300
                  "
                >

                  Empresa selecionada:{" "}

                  <span
                    className="
                      font-semibold
                      text-cyan-300
                    "
                  >
                    {
                      selectedCompanyName ||
                      selectedCompanyId
                    }
                  </span>

                </div>

              )
            }


            {
              selectedFiles.length >
                0 &&
              (

                <div
                  className="
                    mt-4
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-950/60
                    p-4
                  "
                >

                  <div
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    Arquivos selecionados
                  </div>


                  <div
                    className="
                      mt-2
                      space-y-1
                    "
                  >

                    {
                      selectedFiles.map(
                        file => (

                          <div

                            key={
                              `${
                                file.name
                              }-${
                                file.size
                              }`
                            }

                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                              text-sm
                              text-slate-300
                            "
                          >

                            <FileText
                              size={14}
                            />

                            <span>
                              {
                                file.name
                              }
                            </span>

                            <span
                              className="
                                text-slate-600
                              "
                            >
                              ·
                            </span>

                            <span
                              className="
                                text-slate-500
                              "
                            >
                              {
                                bytesToSize(
                                  file.size
                                )
                              }
                            </span>

                          </div>

                        )
                      )
                    }

                  </div>

                </div>

              )
            }


          </section>

        )
      }


      {
        success &&
        (

          <div
            className="
              rounded-xl
              border
              border-emerald-900/60
              bg-emerald-950/20
              px-4
              py-3
              text-sm
              text-emerald-300
            "
          >
            {success}
          </div>

        )
      }


      {
        error &&
        (

          <div
            className="
              rounded-xl
              border
              border-red-900/60
              bg-red-950/20
              px-4
              py-3
              text-sm
              text-red-300
            "
          >
            {error}
          </div>

        )
      }


      <section
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
            flex-col
            gap-3
            border-b
            border-slate-800
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >


          <div>

            <h2
              className="
                font-semibold
                text-white
              "
            >
              Documentos disponíveis
            </h2>


            <p
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >

              {
                mode === "platform"

                  ? (
                      selectedCompanyId

                        ? `Empresa: ${
                            selectedCompanyName ||
                            selectedCompanyId
                          }`

                        : "Selecione uma empresa para consultar os documentos."
                    )

                  : "Documentos vinculados à sua empresa."
              }

            </p>

          </div>


          <span
            className="
              rounded-full
              bg-slate-800
              px-3
              py-1
              text-xs
              font-semibold
              text-slate-300
            "
          >
            {
              sortedDocuments.length
            }
          </span>


        </div>


        {
          mode === "platform" &&
          !selectedCompanyId

            ? (

                <div
                  className="
                    px-5
                    py-14
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  Selecione uma empresa
                  para consultar Alvará / AVCB.
                </div>

              )

            : (

                <>

                  <div
                    className="
                      hidden
                      overflow-x-auto
                      lg:block
                    "
                  >

                    <table
                      className="
                        w-full
                        min-w-[760px]
                      "
                    >

                      <thead
                        className="
                          bg-slate-950
                          text-left
                          text-xs
                          uppercase
                          tracking-wide
                          text-slate-500
                        "
                      >

                        <tr>

                          <th className="px-5 py-3">
                            Arquivo
                          </th>

                          <th className="px-5 py-3">
                            Tamanho
                          </th>

                          <th className="px-5 py-3">
                            Publicado
                          </th>

                          <th className="px-5 py-3">
                            Ações
                          </th>

                        </tr>

                      </thead>


                      <tbody>


                        {
                          loading &&
                          (

                            <tr>

                              <td
                                colSpan={4}
                                className="
                                  px-5
                                  py-12
                                  text-center
                                  text-sm
                                  text-slate-500
                                "
                              >
                                Carregando documentos...
                              </td>

                            </tr>

                          )
                        }


                        {
                          !loading &&
                          sortedDocuments.length === 0 &&
                          (

                            <tr>

                              <td
                                colSpan={4}
                                className="
                                  px-5
                                  py-12
                                  text-center
                                  text-sm
                                  text-slate-500
                                "
                              >
                                Nenhum Alvará / AVCB
                                publicado para esta empresa.
                              </td>

                            </tr>

                          )
                        }


                        {
                          sortedDocuments.map(
                            document => (

                              <tr

                                key={
                                  document.id
                                }

                                className="
                                  border-t
                                  border-slate-800
                                "
                              >


                                <td
                                  className="
                                    px-5
                                    py-4
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-3
                                    "
                                  >

                                    <FileText
                                      size={18}
                                      className="
                                        shrink-0
                                        text-cyan-400
                                      "
                                    />

                                    <div>

                                      <div
                                        className="
                                          font-medium
                                          text-slate-200
                                        "
                                      >
                                        {
                                          document.name
                                        }
                                      </div>

                                      <div
                                        className="
                                          mt-1
                                          text-xs
                                          text-slate-500
                                        "
                                      >
                                        Alvará / AVCB
                                      </div>

                                    </div>

                                  </div>

                                </td>


                                <td
                                  className="
                                    px-5
                                    py-4
                                    text-sm
                                    text-slate-400
                                  "
                                >
                                  {
                                    bytesToSize(
                                      document.size
                                    )
                                  }
                                </td>


                                <td
                                  className="
                                    px-5
                                    py-4
                                    text-sm
                                    text-slate-400
                                  "
                                >
                                  {
                                    formatDate(
                                      document.createdAt
                                    )
                                  }
                                </td>


                                <td
                                  className="
                                    px-5
                                    py-4
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      flex-wrap
                                      gap-2
                                    "
                                  >

                                    <button

                                      type="button"

                                      onClick={() =>
                                        previewDocument(
                                          document
                                        )
                                      }

                                      className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-slate-800
                                        px-3
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-slate-200
                                        transition
                                        hover:bg-slate-700
                                      "
                                    >

                                      <Eye
                                        size={14}
                                      />

                                      Visualizar

                                    </button>


                                    {
                                      canDownload &&
                                      (

                                        <button

                                          type="button"

                                          onClick={() =>
                                            downloadDocument(
                                              document
                                            )
                                          }

                                          className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            bg-cyan-500
                                            px-3
                                            py-2
                                            text-xs
                                            font-bold
                                            text-slate-950
                                            transition
                                            hover:bg-cyan-400
                                          "
                                        >

                                          <Download
                                            size={14}
                                          />

                                          Download

                                        </button>

                                      )
                                    }

                                  </div>

                                </td>

                              </tr>

                            )
                          )
                        }


                      </tbody>

                    </table>

                  </div>


                  <div
                    className="
                      space-y-3
                      p-4
                      lg:hidden
                    "
                  >

                    {
                      loading &&
                      (

                        <div
                          className="
                            py-8
                            text-center
                            text-sm
                            text-slate-500
                          "
                        >
                          Carregando documentos...
                        </div>

                      )
                    }


                    {
                      !loading &&
                      sortedDocuments.length === 0 &&
                      (

                        <div
                          className="
                            py-8
                            text-center
                            text-sm
                            text-slate-500
                          "
                        >
                          Nenhum Alvará / AVCB
                          publicado para esta empresa.
                        </div>

                      )
                    }


                    {
                      sortedDocuments.map(
                        document => (

                          <article

                            key={
                              document.id
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
                                items-start
                                gap-3
                              "
                            >

                              <FileText
                                size={18}
                                className="
                                  mt-0.5
                                  text-cyan-400
                                "
                              />

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >

                                <div
                                  className="
                                    break-words
                                    font-medium
                                    text-slate-200
                                  "
                                >
                                  {
                                    document.name
                                  }
                                </div>

                                <div
                                  className="
                                    mt-2
                                    text-xs
                                    text-slate-500
                                  "
                                >

                                  {
                                    bytesToSize(
                                      document.size
                                    )
                                  }

                                  {" · "}

                                  {
                                    formatDate(
                                      document.createdAt
                                    )
                                  }

                                </div>

                              </div>

                            </div>


                            <div
                              className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-2
                                sm:grid-cols-2
                              "
                            >

                              <button

                                type="button"

                                onClick={() =>
                                  previewDocument(
                                    document
                                  )
                                }

                                className="
                                  inline-flex
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-lg
                                  bg-slate-800
                                  px-3
                                  py-2
                                  text-sm
                                  font-semibold
                                  text-slate-200
                                "
                              >

                                <Eye
                                  size={15}
                                />

                                Visualizar

                              </button>


                              {
                                canDownload &&
                                (

                                  <button

                                    type="button"

                                    onClick={() =>
                                      downloadDocument(
                                        document
                                      )
                                    }

                                    className="
                                      inline-flex
                                      items-center
                                      justify-center
                                      gap-2
                                      rounded-lg
                                      bg-cyan-500
                                      px-3
                                      py-2
                                      text-sm
                                      font-bold
                                      text-slate-950
                                    "
                                  >

                                    <Download
                                      size={15}
                                    />

                                    Download

                                  </button>

                                )
                              }

                            </div>

                          </article>

                        )
                      )
                    }

                  </div>

                </>

              )
        }


      </section>


      {
        preview &&
        (

          <div
            className="
              fixed
              inset-0
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/80
              p-3
              sm:p-6
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
                shadow-2xl
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
                  px-4
                  py-3
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
                      font-semibold
                      text-white
                    "
                  >
                    {
                      preview.name
                    }
                  </div>

                  <div
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    Visualização protegida
                  </div>

                </div>


                <button

                  type="button"

                  onClick={() => {

                    URL.revokeObjectURL(
                      preview.url
                    );

                    setPreview(
                      null
                    );

                  }}

                  className="
                    rounded-lg
                    bg-slate-800
                    p-2
                    text-slate-300
                    transition
                    hover:bg-slate-700
                    hover:text-white
                  "

                  aria-label="Fechar visualização"
                >

                  <X
                    size={18}
                  />

                </button>

              </div>


              <iframe

                title={
                  preview.name
                }

                src={
                  preview.url
                }

                className="
                  h-full
                  w-full
                  bg-white
                "
              />

            </div>

          </div>

        )
      }


    </div>

  );

}
