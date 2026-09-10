"use client";

import {
  Upload,
  FileText
} from "lucide-react";

interface Props {

  setFile: any;
}

export default function UploadZone({

  setFile

}: Props) {

  function handleFiles(
    files: FileList | null
  ) {

    if (!files) {
      return;
    }

    setFile(
      Array.from(files)
    );
  }

  return (

    <div
      onDragOver={e =>
        e.preventDefault()
      }
      onDrop={e => {

        e.preventDefault();

        handleFiles(
          e.dataTransfer.files
        );
      }}
      className="
        relative
        border-2
        border-dashed
        border-slate-700
        hover:border-cyan-500
        transition-all
        rounded-2xl
        p-10
        bg-slate-950
        text-center
      "
    >

      <input
        type="file"
        multiple
        onChange={e =>
          handleFiles(
            e.target.files
          )
        }
        className="
          absolute
          inset-0
          opacity-0
          cursor-pointer
        "
      />

      <div
        className="
          flex
          flex-col
          items-center
          gap-4
        "
      >

        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-cyan-500/10
            flex
            items-center
            justify-center
          "
        >

          <Upload
            className="
              text-cyan-400
            "
            size={28}
          />

        </div>

        <div>

          <h2
            className="
              text-xl
              font-bold
              text-white
            "
          >
            Upload Enterprise
          </h2>

          <p
            className="
              text-slate-400
              mt-2
            "
          >
            Arraste arquivos aqui
            ou clique para selecionar
          </p>

        </div>

        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-500
          "
        >

          <FileText size={16} />

          PDF, DWG, KMZ, DOCX

        </div>

      </div>

    </div>
  );
}
