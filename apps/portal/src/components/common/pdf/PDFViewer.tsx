"use client";

/*
 * ETAPA35A14B_R1_PDF_DUAL_DELIVERY
 *
 * PADRÃO:
 * fetch completo -> Blob -> objectURL.
 *
 * TREINAMENTOS:
 * PDF.js recebe URL protegida + Bearer diretamente.
 *
 * Isso permite streaming e HTTP Range sem
 * esperar o arquivo inteiro virar Blob.
 */

import {
  useEffect,
  useState
} from "react";

import PDFToolbar
from "./components/PDFToolbar";

import dynamic
from "next/dynamic";


const PDFCanvas = dynamic(

  () =>
    import(
      "./components/PDFCanvas"
    ),

  {

    ssr: false,

    loading: () => (

      <div
        className="
          flex
          flex-1
          items-center
          justify-center
          bg-neutral-700
          text-slate-400
        "
      >

        Carregando PDF...

      </div>

    )

  }

);


import {
  PDFViewerProps
} from "./types";


import useResize
from "./hooks/useResize";


export default function PDFViewer({

  open,

  url,

  title,

  onClose,

  canDownload = true,

  streaming = false

}: PDFViewerProps) {


  /*
   * Mantido para o fluxo Blob original.
   */
  const [
    blobUrl,
    setBlobUrl
  ] =
    useState("");


  /*
   * Fonte real enviada ao react-pdf.
   *
   * Pode ser:
   *
   * string blob:
   *
   * ou:
   *
   * {
   *   url,
   *   httpHeaders,
   *   disableRange,
   *   disableStream
   * }
   */
  const [
    documentSource,
    setDocumentSource
  ] =
    useState<any>("");


  const [
    loadError,
    setLoadError
  ] =
    useState("");


  const [
    page,
    setPage
  ] =
    useState(1);


  const [
    pages,
    setPages
  ] =
    useState(0);


  const [
    scale,
    setScale
  ] =
    useState(1);


  const {

    ref,

    width

  } =
    useResize();


  useEffect(() => {


    if (
      !open ||
      !url
    ) {

      return;

    }


    let objectUrl = "";

    let cancelled = false;


    const controller =
      new AbortController();


    setLoadError("");

    setBlobUrl("");

    setDocumentSource("");

    setPage(1);

    setPages(0);

    setScale(1);


    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {

      setLoadError(
        "Sessão não encontrada. Entre novamente."
      );

      return;

    }


    console.log(
      "PDF_URL",
      url
    );


    console.log(
      "PDF_STREAMING",
      streaming
    );


    /*
     * =========================================================
     * TREINAMENTOS
     * =========================================================
     *
     * PDF.js acessa diretamente o endpoint.
     *
     * Authorization continua protegida.
     *
     * Range e streaming ficam habilitados.
     */
    if (streaming) {


      setDocumentSource({

        url,

        httpHeaders: {

          Authorization:
            `Bearer ${token}`

        },

        withCredentials:
          false,

        disableRange:
          false,

        disableStream:
          false,

        disableAutoFetch:
          false,

        rangeChunkSize:
          262144

      });


    } else {


      /*
       * =======================================================
       * FLUXO ORIGINAL
       * =======================================================
       *
       * Mantido para ART / CREA / GED
       * e demais viewers já homologados.
       */
      void (async () => {


        try {


          const res =
            await fetch(

              url,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`

                },

                signal:
                  controller.signal

              }

            );


          console.log(
            "PDF_STATUS",
            res.status
          );


          console.log(
            "PDF_OK",
            res.ok
          );


          console.log(

            "PDF_HEADERS",

            Object.fromEntries(
              res.headers.entries()
            )

          );


          /*
           * Antes o código chamava blob()
           * antes de verificar res.ok.
           *
           * Corrigimos a ordem.
           */
          if (!res.ok) {

            throw new Error(
              `PDF_HTTP_${res.status}`
            );

          }


          const blob =
            await res.blob();


          console.log(
            "PDF_BLOB_TYPE",
            blob.type
          );


          console.log(
            "PDF_BLOB_SIZE",
            blob.size
          );


          if (blob.size <= 0) {

            throw new Error(
              "PDF_EMPTY_RESPONSE"
            );

          }


          if (cancelled) {

            return;

          }


          objectUrl =
            URL.createObjectURL(
              blob
            );


          setBlobUrl(
            objectUrl
          );


          setDocumentSource(
            objectUrl
          );


        } catch (error) {


          if (

            error
              instanceof DOMException

            &&

            error.name ===
              "AbortError"

          ) {

            return;

          }


          console.error(
            "PDF_FETCH_ERROR",
            error
          );


          if (!cancelled) {

            setLoadError(
              "Não foi possível carregar o arquivo PDF."
            );

          }


        }


      })();


    }


    return () => {


      cancelled = true;


      controller.abort();


      if (objectUrl) {

        URL.revokeObjectURL(
          objectUrl
        );

      }


      setBlobUrl("");

      setDocumentSource("");

      setLoadError("");

      setPage(1);

      setPages(0);

      setScale(1);


    };


  }, [

    url,

    open,

    streaming

  ]);


  if (!open) {

    return null;

  }


  return (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black
        flex
        flex-col
      "
    >


      <PDFToolbar

        page={page}

        pages={pages}

        scale={scale}

        setPage={setPage}

        setScale={setScale}

        blobUrl={blobUrl}

        title={title}

        onClose={onClose}

        /*
         * Streaming não usa Blob.
         *
         * O treinamento já possui
         * download separado e controlado.
         */
        canDownload={
          streaming
            ? false
            : canDownload
        }

      />


      {/* ETAPA35A12B_R2_PDF_VIEWPORT */}
      <div

        ref={ref}

        className="
          flex-1
          min-h-0
          min-w-0
          overflow-hidden
        "

      >


        {loadError ? (


          <div
            className="
              h-full
              w-full
              flex
              flex-col
              items-center
              justify-center
              gap-3
              bg-slate-900
              px-6
              text-center
            "
          >


            <div
              className="
                text-base
                font-semibold
                text-red-300
              "
            >

              Não foi possível carregar o PDF.

            </div>


            <div
              className="
                text-sm
                text-slate-400
              "
            >

              {loadError}

            </div>


            <button

              type="button"

              onClick={onClose}

              className="
                mt-2
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-sm
                font-semibold
                text-white
                hover:bg-red-500
              "

            >

              Fechar

            </button>


          </div>


        ) : (


          <PDFCanvas

            /*
             * O nome da prop continua blobUrl
             * para não alterar o componente
             * homologado.
             *
             * Em streaming seu valor é o
             * objeto DocumentInitParameters.
             */
            blobUrl={
              documentSource
            }

            page={page}

            width={width}

            scale={scale}

            setPages={setPages}

          />


        )}


      </div>


    </div>

  );

}
