"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import SearchBar
from "@/components/admin/documents/modules/SearchBar";

import FiltersBar
from "@/components/admin/documents/modules/FiltersBar";


import MonthSelect
from "@/components/admin/documents/modules/selects/MonthSelect";

import FileTable
from "@/components/admin/documents/modules/FileTable";

import {
  getCompanyFiles
} from "@/components/admin/documents/services/documents.service";

import {
  CompanyFile
} from "@/components/admin/documents/types/documents.types";

interface Props {
  companyId: string;
  defaultCategory?: string;
}

export default function ClientDocumentsSection({
  companyId,
  defaultCategory
}: Props) {

  const [files,setFiles] =
    useState<CompanyFile[]>([]);

  const [search,setSearch] =
    useState("");

  const [month,setMonth] =
    useState("01-janeiro");

  const [
    filterCategory,
    setFilterCategory
  ] = useState(
    defaultCategory || ""
  );

  useEffect(() => {
    setFilterCategory(
      defaultCategory || ""
    );
  },[
    defaultCategory
  ]);


  useEffect(() => {
    loadFiles();
  },[
    companyId,
    month,
    filterCategory
  ]);

  async function loadFiles(){

    const data =
      await getCompanyFiles(
        companyId,
        month,
        filterCategory || undefined
      );

    setFiles(
      Array.isArray(data)
        ? data
        : []
    );

  }

  const filtered =
    useMemo(()=>{

      return files.filter(file=>

        file.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    },[
      files,
      search
    ]);

  return (

    <div className="space-y-6">

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <MonthSelect
        month={month}
        setMonth={setMonth}
      />

      <FiltersBar
        filterCategory={filterCategory}
        setFilterCategory={
          setFilterCategory
        }
      />


      <FileTable
        files={filtered}
        onDelete={() => {}}
        canDelete={false}
      />
    </div>

  );

}
