"use client";

import Link from "next/link";

import Card from "../../common/Card";
import PrimaryButton from "../../common/PrimaryButton";

export default function GedCard(){

  return(

    <Card
      className="
        p-8
        flex
        flex-col
        justify-between
        min-h-[520px]
        bg-[#001416]
        border-green-400/20 shadow-[0_0_30px_rgba(0,255,140,.10)]
      "
    >

      <div>

        <div
          className="
            text-4xl
            text-green-400
          "
        >
          ☁️
        </div>

        <h2
          className="
            mt-5
            text-4xl
            font-bold
          "
        >
          GeoFiber GED
        </h2>

        <p
          className="
            mt-6
            text-lg
            leading-8
            text-slate-300
          "
        >
          Armazenamento seguro e organizado
          dos arquivos da empresa.
        </p>

      </div>

      <img

        src="/kmz-gamma/cards/ged.png"

        className="
          mx-auto
          my-10
          w-[300px] max-h-[230px]
          object-contain drop-shadow-2xl
        "

      />

      <Link href="/arquivos">

        <PrimaryButton
          className="
            bg-green-600
            hover:bg-green-500
            text-white
          "
        >

          Abrir GeoFiber GED

        </PrimaryButton>

      </Link>

    </Card>

  );

}
