"use client";

interface Props{
  company?:any;
}

export default function CompanyInfo({

  company

}:Props){

  const fields=[

    {
      label:"Nome Fantasia",
      value:company?.name || "-"
    },

    {
      label:"Razão Social",
      value:company?.companyName || "-"
    },

    {
      label:"CNPJ",
      value:company?.cnpj || "-"
    },

    {
      label:"Responsável Técnico",
      value:company?.technicalResponsible || "-"
    },

    {
      label:"CREA / CFT",
      value:company?.crea || "-"
    },

    {
      label:"E-mail",
      value:company?.email || "-"
    },

    {
      label:"Telefone",
      value:company?.phone || "-"
    },

    {
      label:"Plano",
      value:company?.plan?.name || "Enterprise"
    }

  ];

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
        Dados da Empresa
      </h2>

      <div
        className="
          mt-8
          grid
          gap-6
          md:grid-cols-2
        "
      >

        {

          fields.map(field=>(

            <div
              key={field.label}
            >

              <div
                className="
                  text-xs
                  uppercase
                  tracking-widest
                  text-slate-500
                "
              >
                {field.label}
              </div>

              <div
                className="
                  mt-2
                  text-white
                  font-medium
                "
              >
                {field.value}
              </div>

            </div>

          ))

        }

      </div>

    </section>

  );

}
