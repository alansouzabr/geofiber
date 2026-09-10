"use client";

import {
  FileText,
  Trash2
} from "lucide-react";

interface Props {

  files: File[];

  removeFile: any;
}

export default function UploadList({

  files,

  removeFile

}: Props) {

  const totalSize =
    files.reduce(
      (sum,file)=>sum+file.size,
      0
    );

  const totalSizeMB =
    (
      totalSize/
      1024/
      1024
    ).toFixed(2);

  if (!files.length) {
    return null;
  }

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        overflow-hidden
      "
    >

      <div
        className="
          p-4
          border-b
          border-slate-800
          flex
          items-center
          justify-between
        "
      >

        <h2
          className="
            text-lg
            font-bold
            text-white
          "
        >
          Arquivos Selecionados
        </h2>

        <span
          className="
            text-sm
            text-slate-400
          "
        >
          {files.length} arquivos • {totalSizeMB} MB
        </span>

      </div>

      <div
        className="
          divide-y
          divide-slate-800
        "
      >

        {files.map((file, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              justify-between
              gap-4
              p-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
                min-w-0
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-cyan-500/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <FileText
                  className="
                    text-cyan-400
                  "
                  size={20}
                />

              </div>

              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    text-white
                    font-medium
                    truncate
                  "
                >
                  {file.name}
                </p>

                <p
                  className="
                    text-sm
                    text-slate-400
                    mt-1
                  "
                >
                  {(
                    file.size /
                    1024 /
                    1024
                  ).toFixed(2)} MB
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                removeFile(index)
              }
              className="
                bg-red-500/10
                hover:bg-red-500
                transition
                text-red-400
                hover:text-white
                p-3
                rounded-xl
                shrink-0
              "
            >

              <Trash2 size={18} />

            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
