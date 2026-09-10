"use client";

export default function UserMenu(){

  return(

    <button
      className="
        flex
        items-center
        gap-4
        rounded-2xl
        border
        border-slate-700
        bg-[#111c2c]
        px-3
        py-2
        hover:bg-[#182538]
        transition
      "
    >

      <div
        className="
          h-12
          w-12
          rounded-full
          bg-cyan-500
          flex
          items-center
          justify-center
          font-bold
          text-slate-950
        "
      >
        T
      </div>

      <div
        className="
          text-left
        "
      >

        <div
          className="
            font-semibold
          "
        >
          Técnico
        </div>

        <div
          className="
            text-xs
            text-slate-400
          "
        >
          Online
        </div>

      </div>

    </button>

  );

}
