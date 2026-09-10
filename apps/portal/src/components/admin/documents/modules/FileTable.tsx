"use client";

import {
  useState
} from "react";

import {
  Trash2
} from "lucide-react";

import PDFPreview from "./preview/PDFPreview";
import FileTableMobile from "./mobile/FileTableMobile";

import {
  CompanyFile
} from "../types/documents.types";

const API =
  process.env.NEXT_PUBLIC_API_URL ?? "";

interface Props {

  files: CompanyFile[];

  onDelete: any;

  onRequestDelete?: any;

  canDelete?: boolean;
}

export default function FileTable({

  files,

  onDelete,

  onRequestDelete,

  canDelete=true

}: Props) {

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [previewOpen, setPreviewOpen] =
    useState(false);

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
      "
    >

      <FileTableMobile
        files={files}
        onPreview={(url)=>{
          setPreviewUrl(url);
          setPreviewOpen(true);
        }}
        onDelete={onDelete}
        onRequestDelete={onRequestDelete}
        canDelete={canDelete}
      />

      <div className="hidden lg:block">

      <div className="overflow-x-auto">

        <table
          className="
            w-full
            min-w-[900px]
          "
        >

          <thead
            className="
              bg-slate-950
            "
          >

            <tr>

              <th className="p-4 text-left">
                Arquivo
              </th>

              <th className="p-4 text-left">
                Categoria
              </th>

              <th className="p-4 text-left">
                Visualizar
              </th>

              <th className="p-4 text-left">
                Download
              </th>

              {canDelete && (
                <th className="p-4 text-left">
                  Excluir
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {files.length === 0 && (

              <tr>

                <td
                  colSpan={canDelete ? 5 : 4}
                  className="
                    p-10
                    text-center
                    text-slate-500
                  "
                >
                  Nenhum documento disponível
                </td>

              </tr>

            )}

            {files.map((file, index) => (

              <tr
                key={index}
                className="
                  border-t
                  border-slate-800
                "
              >

                <td className="p-4">
                  {file.name}
                </td>

                <td className="p-4 uppercase">
                  {file.category || "-"}
                </td>

                <td className="p-4">

                  <button
                    onClick={() => {

                      setPreviewUrl(

                        file.fileUrl
                          ? file.fileUrl
                          : (
                              API +
                              "/company-files/view/" +
                              file.id
                            )

                      );

                      setPreviewOpen(
                        true
                      );
                    }}
                    className="
                      bg-slate-700
                      hover:bg-slate-600
                      transition
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      font-semibold
                    "
                  >
                    Visualizar
                  </button>

                </td>

                <td className="p-4">

                  <button
                    onClick={async()=>{

                      if(file.fileUrl){

                        window.open(
                          file.fileUrl,
                          "_blank"
                        );

                        return;

                      }

                      const token=
                        localStorage.getItem("token");

                      const res=
                        await fetch(
                          API+
                          "/company-files/download/"+
                          file.id,
                          {
                            headers:{
                              Authorization:
                                `Bearer ${token}`
                            }
                          }
                        );

                      if(!res.ok){
                        alert("Não foi possível baixar o arquivo.");
                        return;
                      }

                      const blob=
                        await res.blob();

                      const url=
                        window.URL.createObjectURL(blob);

                      const a=
                        document.createElement("a");

                      a.href=url;
                      a.download=file.name;

                      document.body.appendChild(a);
                      a.click();
                      a.remove();

                      window.URL.revokeObjectURL(url);

                    }}
                    className="
                      bg-cyan-500
                      hover:bg-cyan-400
                      transition
                      text-slate-950
                      px-4
                      py-2
                      rounded-lg
                      font-semibold
                    "
                  >
                    Download
                  </button>

                </td>

                {canDelete && (
                  <td className="p-4">

                  <button
                    onClick={() => {

                      if (onRequestDelete) {

                        onRequestDelete(file);

                      } else {

                        onDelete(file.id);

                      }
                    }}
                    className="
                      bg-red-500/10
                      hover:bg-red-500
                      transition
                      text-red-400
                      hover:text-white
                      p-3
                      rounded-xl
                    "
                  >

                    <Trash2 size={18} />

                  </button>

                  </td>
                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      </div>

      <PDFPreview
        url={previewUrl}
        open={previewOpen}
        onClose={() =>
          setPreviewOpen(false)
        }
      />

    </div>
  );
}
