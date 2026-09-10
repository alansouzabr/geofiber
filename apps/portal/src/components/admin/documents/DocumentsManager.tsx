"use client";

import { useContext,
  useEffect,
  useState
} from "react";

import {
  useRouter
} from "next/navigation";

import FileTable from "./modules/FileTable";
import UploadPanel from "./modules/UploadPanel";
import SearchBar from "./modules/SearchBar";
import FiltersBar from "./modules/FiltersBar";
import UploadList from "./modules/upload/UploadList";
import PageHeader from "../ui/PageHeader";
import ConfirmDialog from "../ui/dialogs/ConfirmDialog";
import { AuthContext } from "@/context/AuthContext";
import { getCategories } from "./constants/getCategories";

import {
  getCompanies,
  getCompanyFiles,
  uploadDocuments,
  deleteDocument
} from "./services/documents.service";

import * as TrainingService
from "@/components/training/services/training.service";

const API =
  process.env.NEXT_PUBLIC_API_URL;

const GedService = {

  getCompanies,

  getCompanyFiles,

  uploadDocuments,

  deleteDocument,

};

interface DocumentsManagerProps {
  companyId?: string;

  defaultCategory?: string;

  canonicalRouting?: boolean;

  embedded?: boolean;

  showSearch?: boolean;

  showFilters?: boolean;

  showUpload?: boolean;

  mode?: "ged" | "training";
}

export default function DocumentsManager({

  companyId,

  mode = "ged",

  defaultCategory,

  canonicalRouting = false,

  embedded = false,

  showSearch = true,

  showFilters = true,

  showUpload = true
}: DocumentsManagerProps) {

  const { user } = useContext(AuthContext);

  const router =
    useRouter();

  const canUploadDocuments =
    user?.role === "ROOT" ||
    user?.role === "MASTER";

  const Service =
    mode==="training"
      ? TrainingService
      : GedService;

  const resolvedDefaultCategory =
    defaultCategory ??
    (
      mode==="training"
        ? "Treinamento NR"
        : "TRT"
    );


  console.log("GED_USER=", user);
  console.log("GED_CAN_UPLOAD=", canUploadDocuments);



  const [companies, setCompanies] =
    useState<any[]>([]);

  const [selectedCompany, setSelectedCompany] =
    useState("");

  const [month, setMonth] =
    useState("01-janeiro");

  const [category, setCategory] =
    useState(resolvedDefaultCategory);

  const [filesToUpload, setFilesToUpload] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    confirmUploadOpen,
    setConfirmUploadOpen
  ] = useState(false);

  const [
    deleteTarget,
    setDeleteTarget
  ] = useState<any>(null);

  const [files, setFiles] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [filterCategory, setFilterCategory] =
    useState("");

  /*
   * ETAPA35A12A_CANONICAL_RESPONSIBILITY_CATEGORY
   *
   * ART e TRT possuem rotas canônicas próprias.
   *
   * IMPORTANTE:
   * - aplica somente ao GED;
   * - Treinamentos não são afetados;
   * - não altera os valores armazenados no banco;
   * - apenas normaliza a navegação visual.
   */
    const openCanonicalResponsibilityCategory = (
    value: string
  ) => {

    if (
      mode !== "ged" ||
      !canonicalRouting
    ) {

      return;

    }


    const normalized =
      String(
        value ?? ""
      )
        .trim()
        .toUpperCase();


    const canonicalRoutes:
      Record<string, string> = {

        DOCUMENTOS:
          "/telecom/documentos",

        CONTABILIDADE:
          "/telecom/contabil",

        ART:
          "/telecom/crea",

        TRT:
          "/telecom/cft",

        CERTIDOES:
          "/telecom/certidoes",

        FENINFRA:
          "/telecom/feninfra",

        ANATEL:
          "/telecom/anatel",

        DWG:
          "/telecom/dwg",

        KMZ:
          "/telecom/kmz"

      };


    const nextRoute =
      canonicalRoutes[
        normalized
      ];


    if (!nextRoute) {

      return;

    }


    router.push(
      nextRoute
    );

  };


  const handleCategoryChange = (
    value: string
  ) => {

    setCategory(
      value
    );

    openCanonicalResponsibilityCategory(
      value
    );

  };


  const handleFilterCategoryChange = (
    value: string
  ) => {

    setFilterCategory(
      value
    );

    openCanonicalResponsibilityCategory(
      value
    );

  };



  /*
   * ETAPA35A12B_SYNC_DEFAULT_CATEGORY
   *
   * Ao mudar de uma rota Telecom para outra,
   * a categoria exibida deve acompanhar a URL.
   *
   * Exemplo:
   *
   * /telecom/crea
   *      -> ART
   *
   * /telecom/cft
   *      -> TRT
   */
  useEffect(() => {

    if (
      mode !== "ged" ||
      !canonicalRouting ||
      !defaultCategory
    ) {

      return;

    }


    setCategory(
      defaultCategory
    );


    setFilterCategory(
      defaultCategory
    );

  }, [
    defaultCategory,
    mode,
    canonicalRouting
  ]);


  async function loadCompanies() {

    try {

      const data =
        await Service.getCompanies();

      const safeCompanies =
        Array.isArray(data)
          ? data
          : [];

      setCompanies(
        safeCompanies
      );

      if (safeCompanies[0]) {

        setSelectedCompany(
          safeCompanies[0].id
        );

        loadFiles(
          safeCompanies[0].id
        );
      }

    } catch (err) {

      console.error(err);
    }
  }

  async function loadFiles(
    companyId: string
  ) {

    try {

      const data =
        await Service.getCompanyFiles(
          companyId,
          month,
          category
        );

      setFiles(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(err);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);


  useEffect(() => {

    if (selectedCompany) {

      loadFiles(
        selectedCompany
      );
    }

  }, [

    month,

    category
  ]);

  function removeFile(index: number) {

    setFilesToUpload(prev =>
      prev.filter((_, i) =>
        i !== index
      )
    );
  }

  function openUploadConfirm() {

    console.log("OPEN_CONFIRM_DIALOG");

    setConfirmUploadOpen(true);
  }

  async function upload() {

    if (!filesToUpload.length) {
      return alert(
        "Selecione um arquivo"
      );
    }

    if (!selectedCompany) {
      return alert(
        "Selecione empresa"
      );
    }

    try {

      setLoading(true);

      const form =
        new FormData();

      filesToUpload.forEach(file => {

        form.append(
          "files",
          file
        );
      });

      form.append(
        "companyId",
        selectedCompany
      );

      form.append(
        "category",
        category
      );

      form.append(
        "month",
        month
      );

      const res =
        await Service.uploadDocuments(
          form
        );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Erro upload"
        );

        return;
      }

      alert(
        "Arquivo enviado"
      );

      setFilesToUpload([]);

      loadFiles(
        selectedCompany
      );

    } catch {

      alert(
        "Erro upload"
      );

    } finally {

      setLoading(false);
    }
  }



  async function deleteFile(
    id: string
  ) {

    try {

      await Service.deleteDocument(
        id
      );

      loadFiles(
        selectedCompany
      );

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao excluir"
      );
    }
  }


  const selectedCompanyName =
    companies.find(
      c => c.id === selectedCompany
    )?.name ?? "-";

  const totalUploadSize =
    (
      filesToUpload.reduce(
        (sum,file)=>sum+file.size,
        0
      )/
      1024/
      1024
    ).toFixed(2);


  const filteredFiles =
    Array.isArray(files)
      ? files.filter(file => {
          const matchesSearch =
            file.name
              ?.toLowerCase()
              .includes(search.toLowerCase());

          const matchesCategory =
            !filterCategory ||
            file.category === filterCategory;

  return (
            matchesSearch &&
            matchesCategory
          );
        })
      : [];

  return (

    <div className="space-y-8">


      {showSearch && (
        <SearchBar
          search={search}
          setSearch={setSearch}
        />
      )}

      {showFilters && (
        <FiltersBar
          mode={mode}
          filterCategory={filterCategory}
          setFilterCategory={handleFilterCategoryChange}
        />
      )}

      {showUpload && canUploadDocuments && (
        <UploadPanel
          mode={mode}
          companies={companies}
          month={month}
          setMonth={setMonth}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          category={category}
          setCategory={handleCategoryChange}
          setFile={setFilesToUpload}
          upload={openUploadConfirm}
          loading={loading}
          loadFiles={loadFiles}
          canUpload={canUploadDocuments}
        />
      )}

      {filesToUpload.length > 0 && (
        <UploadList
          files={filesToUpload}
          removeFile={removeFile}
        />
      )}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
        "
      >

        <FileTable
          files={filteredFiles}
          onDelete={deleteFile}
          onRequestDelete={setDeleteTarget}
          canDelete={canUploadDocuments}
        />

      </div>

      <ConfirmDialog
        open={confirmUploadOpen}
        title="Confirmar envio"
        message={
`Empresa: ${selectedCompanyName}

Categoria: ${category.toUpperCase()}

Mês: ${month}

Arquivos: ${filesToUpload.length}

Total: ${totalUploadSize} MB`
}
        loading={loading}
        confirmText="Enviar"
        cancelText="Cancelar"
        onCancel={() => setConfirmUploadOpen(false)}
        onConfirm={async () => {
          setConfirmUploadOpen(false);
          await upload();
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir arquivo"
        message={
deleteTarget
? `Deseja excluir o arquivo?

${deleteTarget.name}`
: ""
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={async () => {

          const id=deleteTarget?.id;

          setDeleteTarget(null);

          if(id){
            await deleteFile(id);
          }

        }}
      />


    </div>
  );
}
