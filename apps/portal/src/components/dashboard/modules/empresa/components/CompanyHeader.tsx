"use client";

interface Props{
  company:any;
}

export default function CompanyHeader({

  company

}:Props){

  return(

    <section
      className="
        rounded-3xl
        border
        border-slate-800
        bg-[#081223]
        p-8
      "
    >

      <div
        className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <div
            className="
              text-xs
              uppercase
              tracking-widest
              text-slate-400
            "
          >
            Empresa
          </div>

          <h1
            className="
              mt-2
              text-4xl
              font-bold
              text-white
            "
          >
            {company?.name || "Empresa"}
          </h1>

          <p
            className="
              mt-3
              text-slate-400
            "
          >
            Administração completa da empresa.
          </p>

        </div>

        <div
          className="
            grid
            gap-4
            sm:grid-cols-3
          "
        >

          <div>

            <div className="text-xs text-slate-500">
              Status
            </div>

            <div
              className="mt-1 font-semibold"
              style={{
                color:
                  company?.isActive
                    ? "#22c55e"
                    : "#f59e0b"
              }}
            >
              {
                company?.isActive
                  ? "ATIVA"
                  : "PENDENTE"
              }
            </div>

          </div>

          <div>

            <div className="text-xs text-slate-500">
              Plano
            </div>

            <div className="mt-1 text-white font-semibold">
              {company?.plan?.name || "Enterprise"}
            </div>

          </div>

          <div>

            <div className="text-xs text-slate-500">
              CNPJ
            </div>

            <div className="mt-1 text-white font-semibold">
              {company?.cnpj || "-"}
            </div>

          </div>

        </div>

      </div>

    </section>

  );

}
