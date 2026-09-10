"use client";

import "./../pdf_viewer.css";

export default function PDFJSViewer(){

  return(

    <div
      className="
        h-full
        w-full
        overflow-auto
        bg-neutral-700
      "
    >

      <div
        id="pdfjs-container"
        className="
          pdfViewer
        "
      />

    </div>

  );

}
