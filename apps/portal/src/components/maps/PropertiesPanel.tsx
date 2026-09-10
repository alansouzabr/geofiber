"use client";

interface Props {

  selected: any;

  setMarkers: any;
}

export default function PropertiesPanel({

  selected,

  setMarkers

}: Props) {

  if (!selected) {

    return null;
  }

  function updateColor(
    color: string
  ) {

    setMarkers(
      (prev: any) =>

        prev.map(
          (item: any) => {

            if (
              item.id ===
              selected.id
            ) {

              return {

                ...item,

                color
              };
            }

            return item;
          }
        )
    );
  }

  return (

    <div
      className="
        absolute

        top-24
        right-4

        z-[9999]

        w-[280px]

        rounded-2xl

        bg-[#020817]/95

        border
        border-cyan-500/20

        backdrop-blur-xl

        shadow-2xl

        p-4
      "
    >

      <div
        className="
          text-sm
          font-semibold
          text-white
          mb-4
        "
      >

        Propriedades FTTH

      </div>

      <div
        className="
          space-y-2
          text-xs
        "
      >

        <div
          className="
            text-slate-300
          "
        >

          Tipo:
          {" "}
          {selected.type}

        </div>

        {selected.ports && (

          <>

            <div
              className="
                text-slate-300
              "
            >

              Portas:
              {" "}
              {selected.ports}

            </div>

            <div
              className="
                text-slate-300
              "
            >

              Ocupadas:
              {" "}
              {selected.usedPorts}

            </div>

          </>
        )}

      </div>

      <div
        className="
          flex
          gap-2
          mt-5
        "
      >

        {[
          "#ef4444",
          "#22c55e",
          "#3b82f6",
          "#f97316",
          "#a855f7"
        ].map((color) => (

          <button

            key={color}

            onClick={() =>
              updateColor(color)
            }

            className="
              w-7
              h-7

              rounded-full

              border
              border-white/20
            "

            style={{
              background:
                color
            }}
          />
        ))}

      </div>

    </div>
  );
}
