"use client";

import Link from "next/link";

import Card from "../../common/Card";
import PrimaryButton from "../../common/PrimaryButton";

interface Props{

  title:string;

  description:string;

  href:string;

}

export default function PlatformCard({

  title,

  description,

  href

}:Props){

  return(

    <Card
      className="
        p-8
        flex
        flex-col
        justify-between
        min-h-[340px]
      "
    >

      <div>

        <div
          className="
            h-16
            w-16
            rounded-2xl
            bg-cyan-500/20
            border
            border-cyan-500/30
          "
        />

        <h2
          className="
            mt-8
            text-3xl
            font-bold
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-4
            text-slate-400
            leading-7
          "
        >
          {description}
        </p>

      </div>

      <Link
        href={href}
      >

        <PrimaryButton>

          Abrir Plataforma

        </PrimaryButton>

      </Link>

    </Card>

  );

}
