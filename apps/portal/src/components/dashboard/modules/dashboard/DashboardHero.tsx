"use client";

interface Props{
  company:any;
}

export default function DashboardHero({
  company,
}:Props){

  return(

    <section
      className="
        rounded-3xl
        border
        border-slate-700
        bg-[#081223]
        px-8
        py-7
      "
    >

      <div
        className="
          text-xs
          uppercase
          tracking-widest
          text-slate-400
        "
      >
        Dashboard Enterprise
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
          mt-4
          max-w-3xl
          text-slate-300
          leading-7
        "
      >
        Central de gerenciamento da empresa,
        projetos, usuários, documentos,
        financeiro e execução.
      </p>

    </section>

  );

}
