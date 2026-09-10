"use client";

import Link from "next/link";

import Card from "../../common/Card";
import PrimaryButton from "../../common/PrimaryButton";
import CardImage from "../../common/CardImage";

export default function KmzCard(){

  return(

    <Card
      className="
        p-8
        flex
        flex-col
        justify-between
        min-h-[520px]
      "
    >

      <div>

        <div
          className="
            text-4xl
            text-cyan-400
          "
        >
          🗺️
        </div>

        <h2
          className="
            mt-5
            text-4xl
            font-bold
          "
        >
          Plataforma KMZ
        </h2>

        <p
          className="
            mt-6
            text-lg
            leading-8
            text-slate-300
          "
        >
          Distribuidor KMZ/KML.

          Gere e visualize
          rotas e estruturas
          no Google Earth.
        </p>

      </div>

      
<CardImage
  src="/kmz-gamma/cards/kmz.png"
  alt="Plataforma KMZ"
/>


      <Link href="/projetos/kmz">

        <PrimaryButton
          className="
            bg-blue-600
            hover:bg-blue-500
            text-white
          "
        >

          Abrir Plataforma KMZ

        </PrimaryButton>

      </Link>

    </Card>

  );

}
