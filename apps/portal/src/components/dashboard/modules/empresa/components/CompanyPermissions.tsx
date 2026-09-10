"use client";

const roles=[

"MASTER",

"ADMIN",

"GERENTE",

"PROJETISTA",

"TÉCNICO",

"INSTALADOR",

"LANÇADOR",

"VENDEDOR",

"VISUALIZADOR"

];

export default function CompanyPermissions(){

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
        Permissões
      </h2>

      <p
        className="
          mt-2
          text-slate-400
        "
      >
        Controle de cargos e permissões da empresa.
      </p>

      <div
        className="
          mt-8
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {

          roles.map(role=>(

            <div

              key={role}

              className="
                rounded-xl
                border
                border-slate-700
                p-5
              "

            >

              <div
                className="
                  font-semibold
                  text-white
                "
              >
                {role}
              </div>

              <div
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Configuração de permissões em desenvolvimento.
              </div>

            </div>

          ))

        }

      </div>

    </section>

  );

}
