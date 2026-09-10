"use client";

export default function AnalyticsPanel({
  markers,
  fibers
}: any) {

  return (

    <div
      className="
        rounded-2xl

        bg-[#020817]/92
        backdrop-blur-xl

        border
        border-white/10

        p-4
      "
    >

      <div
        className="
          text-white
          font-bold
          mb-3
        "
      >

        Analytics FTTH

      </div>

      <div
        className="
          grid
          grid-cols-2
          gap-2
        "
      >

        <div
          className="
            bg-slate-900/80
            rounded-xl
            p-3
          "
        >

          <div
            className="
              text-slate-400
              text-xs
            "
          >

            Postes

          </div>

          <div
            className="
              text-cyan-400
              text-xl
              font-bold
            "
          >

            {markers.length}

          </div>

        </div>

        <div
          className="
            bg-slate-900/80
            rounded-xl
            p-3
          "
        >

          <div
            className="
              text-slate-400
              text-xs
            "
          >

            Fibras

          </div>

          <div
            className="
              text-orange-400
              text-xl
              font-bold
            "
          >

            {fibers.length}

          </div>

        </div>

      </div>

    </div>
  );
}
