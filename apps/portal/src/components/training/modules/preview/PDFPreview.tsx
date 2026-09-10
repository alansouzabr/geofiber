"use client";

import PDFViewer
from "@/components/common/pdf/PDFViewer";

interface Props{

  url:string;

  open:boolean;

  onClose:any;

}

export default function PDFPreview({

  url,

  open,

  onClose

}:Props){

  return(

    <PDFViewer

      open={open}

      url={url}

      title="Visualizador PDF"

      onClose={onClose}

        streaming={true}

        canDownload={false}

    />

  );

}
