"use client";

import { Trash2 } from "lucide-react";
import { CompanyFile } from "../../types/documents.types";

const API =
  process.env.NEXT_PUBLIC_API_URL ?? "";

interface Props {
  files: CompanyFile[];
  onPreview: (url: string) => void;
  onDelete: (id: string) => void;
  onRequestDelete?: (file: CompanyFile) => void;
  canDelete?: boolean;
}

export default function FileTableMobile({
  files,
  onPreview,
  onDelete,
  onRequestDelete,
  canDelete=true
}: Props) {

  if (files.length === 0) {
    return (
      <div className="lg:hidden p-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Nenhum documento disponível
        </div>
      </div>
    );
  }

  return (

    <div className="lg:hidden space-y-4 p-4">

      {files.map(file => (

        <div
          key={file.id}
          className="
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-5
            shadow-sm
          "
        >

          <h3
            className="
              break-all
              text-base
              font-bold
              text-white
            "
          >
            {file.name}
          </h3>

          <div className="mt-3">

            <span className="text-xs text-slate-400">
              Categoria
            </span>

            <div className="mt-1 uppercase font-semibold text-cyan-400">
              {file.category || "-"}
            </div>

          </div>

          <div className="mt-5 grid grid-cols-1 gap-3">

            <button
              onClick={() => onPreview(
                file.fileUrl
                  ? file.fileUrl
                  : (
                      API +
                      "/company-files/view/" +
                      file.id
                    )
              )}
              className="
                rounded-xl
                bg-slate-700
                py-3
                font-semibold
                text-white
                transition
                hover:bg-slate-600
              "
            >
              Visualizar
            </button>

            <a
              href={
                API +
                "/company-files/download/" +
                file.id
              }
              download
              className="
                rounded-xl
                bg-cyan-500
                py-3
                text-center
                font-bold
                text-slate-950
                transition
                hover:bg-cyan-400
              "
            >
              Download
            </a>

              {canDelete && (

              <button
                onClick={() => {

                  if (onRequestDelete) {

                    onRequestDelete(file);

                  } else {

                    onDelete(file.id);

                  }

                }}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  py-3
                  font-bold
                  text-white
                  transition
                  hover:bg-red-500
                "
              >
                <Trash2 size={18} />
                Excluir
              </button>

              )}

          </div>

        </div>

      ))}

    </div>

  );

}
