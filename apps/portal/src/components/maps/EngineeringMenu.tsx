"use client";

export default function EngineeringMenu({

  tool

}: any) {

  return (

    <div
      className="
        absolute
        top-24
        left-[112px]
        z-[999]

        w-[290px]

        rounded-3xl

        bg-[#020817]/96
        backdrop-blur-xl

        border
        border-cyan-500/10

        p-5

        text-white

        shadow-2xl
      "
    >

      <h2
        className="
          text-xl
          font-black
          mb-5
        "
      >
        Engenharia FTTH
      </h2>

      {

        tool === "projects"

        && (

          <div
            className="
              space-y-3
            "
          >

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              📁 Cidade
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              📂 Bairro
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              🗂 Projeto
            </button>

          </div>
        )
      }

      {

        tool === "pole"

        && (

          <div
            className="
              space-y-3
            "
          >

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              Poste Concreto
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              Poste Metálico
            </button>

          </div>
        )
      }

      {

        tool === "cto"

        && (

          <div
            className="
              space-y-3
            "
          >

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              CTO 1x8
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              CTO 1x16
            </button>

          </div>
        )
      }

      {

        tool === "fiber"

        && (

          <div
            className="
              space-y-3
            "
          >

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              Fibra 12FO
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              Fibra 24FO
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              Fibra 36FO
            </button>

            <button className="w-full bg-white/5 p-3 rounded-xl text-left">
              Fibra 72FO
            </button>

          </div>
        )
      }

    </div>
  );
}
