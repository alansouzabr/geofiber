"use client";

import {
  PDFToolbarProps
} from "../types/index";

export default function PDFToolbar({

  page,

  pages,

  scale,

  setPage,

  setScale,

  blobUrl,

  title,

  onClose,

  canDownload=true

}: PDFToolbarProps){

  console.log("PDF_TOOLBAR_CAN_DOWNLOAD",canDownload);


  return (

    <div
      className="
        h-16
        bg-slate-950
        border-b
        border-slate-800
        flex
        items-center
        justify-between
        px-5
      "
    >

      <div
        className="
          text-white
          font-semibold
          truncate
          max-w-md
        "
      >
        {title}
      </div>

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <button
          onClick={()=>
            setPage(
              Math.max(
                1,
                page-1
              )
            )
          }
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            hover:bg-slate-700
          "
        >
          ◀
        </button>

        <div
          className="
            text-white
            min-w-[90px]
            text-center
          "
        >
          {page} / {pages}
        </div>

        <button
          onClick={()=>
            setPage(
              Math.min(
                pages,
                page+1
              )
            )
          }
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            hover:bg-slate-700
          "
        >
          ▶
        </button>

        <div className="w-4"/>

        <button
          onClick={()=>
            setScale(
              Math.max(
                0.5,
                scale-0.2
              )
            )
          }
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            hover:bg-slate-700
          "
        >
          −
        </button>

        <div
          className="
            text-white
            min-w-[70px]
            text-center
          "
        >
          {Math.round(scale*100)}%
        </div>

        <button
          onClick={()=>
            setScale(
              Math.min(
                3,
                scale+0.2
              )
            )
          }
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            hover:bg-slate-700
          "
        >
          +
        </button>

        <div className="w-6"/>

        {canDownload && (

        <a
          href={blobUrl}
          download
          className="
            px-4
            py-2
            rounded-lg
            bg-cyan-500
            hover:bg-cyan-400
            text-slate-950
            font-semibold
          "
        >
          Download
        </a>

        )}

        <button
          onClick={onClose}
          className="
            px-4
            py-2
            rounded-lg
            bg-red-600
            hover:bg-red-500
            text-white
            font-semibold
          "
        >
          Fechar
        </button>

      </div>

    </div>

  );

}
