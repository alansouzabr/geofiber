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
  TrainingFile
} from "../types/training";

const API =
  process.env.NEXT_PUBLIC_API_URL ?? "";

interface Props {

  files: TrainingFile[];

  onDelete: any;

  onRequestDelete?: any;

  canDelete?: boolean;

  canDownload?: boolean;
}

export default function FileTable({

  files,

  onDelete,

  onRequestDelete,

  canDelete=true,

  canDownload=true

}: Props) {

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [previewOpen, setPreviewOpen] =
    useState(false);


  // ETAPA34A1B_TRAINING_SECURE_DELIVERY

  function handlePreview(
    file: TrainingFile
  ) {

    if (!file.id) {

      alert(
        "Arquivo sem identificador disponível."
      );

      return;

    }


    setPreviewUrl(
      API +
      "/global-library/view/" +
      encodeURIComponent(
        file.id
      )
    );


    setPreviewOpen(
      true
    );

  }


  async function handleDownload(
    file: TrainingFile
  ) {

    if (!file.id) {

      alert(
        "Arquivo sem identificador disponível."
      );

      return;

    }


    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {

      alert(
        "Sessão não encontrada. Entre novamente."
      );

      return;

    }


    try {

      const response =
        await fetch(
          API +
          "/global-library/download/" +
          encodeURIComponent(
            file.id
          ),
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      if (!response.ok) {

        throw new Error(
          `DOWNLOAD_HTTP_${response.status}`
        );

      }


      const blob =
        await response.blob();


      const objectUrl =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        objectUrl;


      link.download =
        file.name ||
        "arquivo";


      link.style.display =
        "none";


      document.body.appendChild(
        link
      );


      link.click();

      link.remove();


      window.setTimeout(
        () => {

          URL.revokeObjectURL(
            objectUrl
          );

        },
        1000
      );

    } catch (error) {

      console.error(
        "TRAINING_DOWNLOAD_ERROR",
        error
      );


      alert(
        "Não foi possível baixar o arquivo."
      );

    }

  }

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
        onPreview={handlePreview}
        onDownload={handleDownload}
        onDelete={onDelete}
        onRequestDelete={onRequestDelete}
        canDelete={canDelete}
        canDownload={canDownload}
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
                      handlePreview(
                        file
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

                  {canDownload && (

<button
                    onClick={() => {
                      void handleDownload(
                        file
                      );
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

                  )}

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
