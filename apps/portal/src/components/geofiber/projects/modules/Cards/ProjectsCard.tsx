"use client";

import Link from "next/link";

import Card from "../../common/Card";
import PrimaryButton from "../../common/PrimaryButton";
import CardImage from "../../common/CardImage";

export default function ProjectsCard(){

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
          Projetos GIS
        </h2>

        <p
          className="
            mt-6
            text-lg
            leading-8
            text-slate-300
          "
        >
          Gerenciamento de projetos geoespaciais.

          Crie, importe e visualize
          projetos, mapas,
          rotas e estruturas.
        </p>

      </div>

      
<CardImage
  src="/kmz-gamma/cards/kmz.png"
  alt="Projetos GIS"
/>


      <Link href="/projetos/kmz">

        <PrimaryButton
          className="
            bg-blue-600
            hover:bg-blue-500
            text-white
          "
        >

          Abrir Projetos GIS

        </PrimaryButton>

      </Link>

    </Card>

  );

}
