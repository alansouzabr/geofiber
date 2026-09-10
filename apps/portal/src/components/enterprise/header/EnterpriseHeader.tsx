"use client";


export default function EnterpriseHeader({
  company,
  onOpenMenu
}: {
  company:any;
  onOpenMenu?:()=>void;
}) {

  return (

    <header
      className="
        h-auto
        min-h-[80px]
        border-b
        border-slate-800
        bg-[#020817]
        flex
        flex-col
        lg:flex-row
        lg:items-center
        justify-between
        gap-4
        px-4
        lg:px-8
        py-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          w-full
        "
      >

        <button
          onClick={onOpenMenu}
          className="
            lg:hidden
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-3
            py-2
            text-white
          "
        >
          ☰
        </button>

        <input
          placeholder="Buscar no Enterprise..."
          className="
            w-full
            lg:w-[320px]
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            outline-none
            text-sm
          "
        />

      </div>

      <div
        className="
          flex
          items-center
          lg:justify-end
          gap-3
          w-full
          lg:w-auto
        "
      >

        <div
          className="
            hidden
            md:block
            text-right
          "
        >

          <p
            className="
              text-sm
              font-semibold
              text-white
            "
          >
            {company?.name || "Empresa"}
          </p>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            {company?.email || ""}
          </p>

        </div>

        <div
          className="
            w-11
            h-11
            rounded-full
            bg-cyan-500
            flex
            items-center
            justify-center
            font-bold
            text-slate-950
            shrink-0
          "
        >
          T
        </div>
</div>

    </header>
  );
}
