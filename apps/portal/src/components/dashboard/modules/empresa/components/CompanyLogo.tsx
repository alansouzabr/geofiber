"use client";

interface Props{
  company?:any;
}

export default function CompanyLogo({

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

      <h2
        className="
          text-2xl
          font-bold
          text-white
        "
      >
        Logotipo
      </h2>

      <div
        className="
          mt-8
          flex
          flex-col
          items-center
          gap-6
          md:flex-row
        "
      >

        <div
          className="
            flex
            h-32
            w-32
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-slate-700
            bg-slate-900
            text-slate-500
          "
        >
          LOGO
        </div>

        <div>

          <p
            className="
              text-slate-400
            "
          >
            O logotipo da empresa será utilizado em
            documentos, ART/TRT, relatórios e dashboard.
          </p>

          <button
            className="
              mt-6
              rounded-xl
              bg-cyan-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-cyan-500
            "
            type="button"
          >
            Alterar Logotipo
          </button>

        </div>

      </div>

    </section>

  );

}
