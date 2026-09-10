"use client";

const items=[

"Alterar senha",

"Autenticação em dois fatores",

"Sessões ativas",

"Tokens de API",

"Histórico de acesso"

];

export default function CompanySecurity(){

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
        Segurança
      </h2>

      <p
        className="
          mt-2
          text-slate-400
        "
      >
        Configurações de segurança da empresa.
      </p>

      <div
        className="
          mt-8
          grid
          gap-4
          md:grid-cols-2
        "
      >

        {

          items.map(item=>(

            <div

              key={item}

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
                {item}
              </div>

              <div
                className="
                  mt-2
                  text-sm
                  text-slate-500
                "
              >
                Funcionalidade será integrada na próxima etapa.
              </div>

            </div>

          ))

        }

      </div>

    </section>

  );

}
