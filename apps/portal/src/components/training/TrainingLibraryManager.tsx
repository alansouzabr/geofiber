"use client";

import { useContext,
  useEffect,
  useState
} from "react";

import FileTable from "./modules/FileTable";
import UploadPanel from "./modules/UploadPanel";
import SearchBar from "./modules/SearchBar";
import FiltersBar from "./modules/FiltersBar";
import UploadList from "./modules/upload/UploadList";
import PageHeader from "../ui/PageHeader";
import ConfirmDialog from "./ui/dialogs/ConfirmDialog";
import { AuthContext } from "@/context/AuthContext";
import { getCategories } from "./constants/getCategories";

import {
  getCompanies,
  getCompanyFiles,
  uploadDocuments,
  deleteDocument
} from "./services/training.service";


const API =
  process.env.NEXT_PUBLIC_API_URL;


interface TrainingLibraryManagerProps {
  defaultCategory?: string;

  allowedCategories?: string[];

  embedded?: boolean;

  showSearch?: boolean;

  showFilters?: boolean;

  showUpload?: boolean;

}

export default function TrainingLibraryManager({

  defaultCategory,


  allowedCategories,
  embedded = false,

  showSearch = true,

  showFilters = true,

  showUpload = true
}: TrainingLibraryManagerProps) {

  const { user } = useContext(AuthContext);

  const isTrainingAdmin =
    user?.role === "ROOT" ||
    user?.role === "MASTER";

const canUploadDocuments =
    isTrainingAdmin;

const canDeleteDocuments =
    isTrainingAdmin;

const canDownloadDocuments =
    isTrainingAdmin;


  // ETAPA35A13C_CONTEXTUAL_TRAINING_CATEGORIES
  // allowedCategories restringe apenas a UI do contexto.
  // A lista global permanece intacta.

  const resolvedDefaultCategory =
    defaultCategory ??
    "Treinamento NR";


  console.log("TRAINING_USER=", user);
  console.log("TRAINING_CAN_UPLOAD=", canUploadDocuments);



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
   * ETAPA35A5_SYNC_DEFAULT_CATEGORY
   *
   * CompanyTrainingDetail reutiliza o mesmo
   * TrainingLibraryManager ao alternar:
   *
   * - Normas Regulamentadoras
   * - TI / Redes / Telecom
   *
   * useState(resolvedDefaultCategory) usa a prop
   * apenas na primeira montagem.
   *
   * Quando defaultCategory muda, sincronizamos
   * o estado interno e removemos imediatamente
   * os arquivos da categoria anterior.
   *
   * O useEffect existente que depende de
   * category executará o novo fetch.
   */
  useEffect(() => {

    setFiles([]);

    setCategory(
      resolvedDefaultCategory
    );

  }, [
    resolvedDefaultCategory
  ]);


  async function loadCompanies() {

    try {

      const data =
        await getCompanies();

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
        await getCompanyFiles(
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
        await uploadDocuments(
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

      await deleteDocument(
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
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
        
            allowedCategories={allowedCategories}/>
      )}

      {showUpload && canUploadDocuments && (
        <UploadPanel
          companies={companies}
          month={month}
          setMonth={setMonth}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          category={category}
          setCategory={setCategory}
          
          allowedCategories={allowedCategories}setFile={setFilesToUpload}
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
          canDelete={canDeleteDocuments}
          canDownload={canDownloadDocuments}
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
