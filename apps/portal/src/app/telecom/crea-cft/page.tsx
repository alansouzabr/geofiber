import Link
  from "next/link";

import {
  ClipboardCheck,
  FileSignature
} from "lucide-react";


export default function TelecomCreaCftPage() {

  return (

    <div
      className="
        mx-auto
        max-w-5xl
        space-y-8
      "
    >

      <header>

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          CREA / CFT
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-400
          "
        >
          Documentação de responsabilidade
          técnica e registros profissionais.
        </p>

      </header>


      <div
        className="
          grid
          gap-5
          md:grid-cols-2
        "
      >

        <Link
          href="/telecom/crea"
          className="
            group
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            transition
            hover:border-cyan-500/60
            hover:bg-slate-800
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <FileSignature
              className="
                text-cyan-400
              "
              size={22}
            />

            <h2
              className="
                text-xl
                font-bold
                text-cyan-400
              "
            >
              CREA / ART
            </h2>

          </div>

          <p
            className="
              mt-4
              text-sm
              text-slate-400
            "
          >
            CREA, ART e documentação
            de engenharia.
          </p>

        </Link>


        <Link
          href="/telecom/cft"
          className="
            group
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
            p-6
            transition
            hover:border-cyan-500/60
            hover:bg-slate-800
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <ClipboardCheck
              className="
                text-cyan-400
              "
              size={22}
            />

            <h2
              className="
                text-xl
                font-bold
                text-cyan-400
              "
            >
              CFT / TRT
            </h2>

          </div>

          <p
            className="
              mt-4
              text-sm
              text-slate-400
            "
          >
            CFT, TRT e documentação
            técnica profissional.
          </p>

        </Link>

      </div>

    </div>

  );

}
