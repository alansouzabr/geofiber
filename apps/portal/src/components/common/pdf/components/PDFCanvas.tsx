"use client";

import {
  Document,
  Page,
  pdfjs
} from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Props{

  blobUrl:string;

  page:number;

  width:number;

  scale:number;

  setPages(value:number):void;

}

export default function PDFCanvas({

  blobUrl,

  page,

  width,

  scale,

  setPages

}:Props){

  if(!blobUrl){

    return(

      <div
        className="
          flex
          flex-1
          items-center
          justify-center
          text-slate-400
          bg-slate-900
        "
      >
        Carregando PDF...
      </div>

    );

  }

  // ETAPA35A12B_R2_PDF_READING_QUADRANT
// Folha PDF branca, contida no viewport,
// sem text/annotation layer externa.
// ETAPA34A2D_PDF_VIEWER
  //
  // 100% usa uma largura de leitura.
  // O zoom continua sendo aplicado depois.
  const horizontalPadding=
    width < 640
      ? 16
      : 48;

  const fitWidth=
    Math.max(
      280,
      Math.min(
        1000,
        Math.floor(
          width-horizontalPadding
        )
      )
    );

  const pageWidth=
    Math.max(
      280,
      Math.floor(
        fitWidth*scale
      )
    );

  return(

    <div
      className="
          h-full
          min-h-0
          w-full
          min-w-0
          overflow-auto
          overscroll-contain
          bg-slate-900
        "
    >

      <div
        className="
          min-w-max
          flex
          justify-center
          pt-4
          pb-8
        "
      >

        <Document

          file={blobUrl}

          loading="Carregando PDF..."

          onLoadSuccess={({numPages})=>{

            console.log(
              "PDF_NUM_PAGES",
              numPages
            );

            setPages(numPages);

          }}

          onLoadError={(err)=>{

            console.error(
              "PDF_LOAD_ERROR",
              err
            );

          }}

          onSourceError={(err)=>{

            console.error(
              "PDF_SOURCE_ERROR",
              err
            );

          }}

        >

          <Page

            pageNumber={page}

            width={pageWidth}
            className="bg-white shadow-2xl"
            canvasBackground="#ffffff"

            renderAnnotationLayer={false}

            renderTextLayer={false}

          />

        </Document>

      </div>

    </div>

  );

}
