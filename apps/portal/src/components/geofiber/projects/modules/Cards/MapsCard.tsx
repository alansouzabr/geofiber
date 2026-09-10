"use client";

import Link from "next/link";

import Card from "../../common/Card";
import PrimaryButton from "../../common/PrimaryButton";

export default function MapsCard(){

  return(

    <Card
      className="
        p-8
        flex
        flex-col
        justify-between
        min-h-[520px]
        bg-[#050222]
        border-fuchsia-400/20 shadow-[0_0_30px_rgba(168,85,247,.12)]
      "
    >

      <div>

        <div
          className="
            text-4xl
            text-fuchsia-400
          "
        >
          📍
        </div>

        <h2
          className="
            mt-5
            text-4xl
            font-bold
          "
        >
          GeoFiber Maps
        </h2>

        <p
          className="
            mt-6
            text-lg
            leading-8
            text-slate-300
          "
        >
          Plataforma de mapas interativa
          para projetos de fibra óptica,
          backbone, CTOs e documentação.
        </p>

      </div>

      <img

        src="/kmz-gamma/cards/maps.png"

        className="
          mx-auto
          my-10
          w-[300px] max-h-[230px]
          object-contain drop-shadow-2xl
        "

      />

      <Link href="/maps">

        <PrimaryButton
          className="
            bg-violet-600
            hover:bg-violet-500
            text-white
          "
        >

          Abrir GeoFiber Maps

        </PrimaryButton>

      </Link>

    </Card>

  );

}
