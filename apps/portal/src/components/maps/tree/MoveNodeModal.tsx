"use client";

interface Props {

  open: boolean;

  tree: any[];

  onClose: () => void;

  onMove: (
    targetId: number
  ) => void;
}

function renderTree(
  items: any[],
  onMove: any,
  level = 0
) {

  return items.map((item) => (

    <div
      key={item.id}
    >

      <button

        onClick={() =>
          onMove(item.id)
        }

        className="
          w-full
          text-left

          px-3
          py-2

          rounded-xl

          text-[12px]
          text-slate-200

          hover:bg-cyan-500/10

          transition-all
        "

        style={{
          paddingLeft:
            14 + level * 18
        }}
      >

        📁 {item.name}

      </button>

      {item.children &&
        item.children.length > 0 &&
        renderTree(
          item.children,
          onMove,
          level + 1
        )}

    </div>
  ));
}

export default function MoveNodeModal({

  open,

  tree,

  onClose,

  onMove

}: Props) {

  if (!open)
    return null;

  return (

    <div
      className="
        fixed
        inset-0

        z-[9999999]

        flex
        items-center
        justify-center

        bg-black/40

        backdrop-blur-sm
      "
    >

      <div
        className="
          w-[420px]

          max-h-[80vh]

          overflow-auto

          rounded-3xl

          bg-[#0f172a]

          border
          border-white/10

          shadow-2xl
        "
      >

        <div
          className="
            flex
            items-center
            justify-between

            px-5
            py-4

            border-b
            border-white/10
          "
        >

          <div
            className="
              text-sm
              font-semibold
              text-white
            "
          >

            Mover

          </div>

          <button

            onClick={onClose}

            className="
              text-white/60

              hover:text-white

              transition-all
            "
          >

            ✕

          </button>

        </div>

        <div
          className="
            p-3

            flex
            flex-col

            gap-1
          "
        >

          {renderTree(
            tree,
            onMove
          )}

        </div>

      </div>

    </div>
  );
}
