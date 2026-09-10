import SstCompanyLibraryManager
  from "@/components/safety/SstCompanyLibraryManager";


export default function SstPgrPcmsoPage() {

  return (

    <div className="space-y-8">

      <header>

        <h1 className="text-3xl font-bold">
          SST / PGR / PCMSO
        </h1>


        <p
          className="
            mt-2
            max-w-4xl
            text-slate-400
          "
        >
          Segurança e Saúde no Trabalho,
          Programa de Gerenciamento de Riscos
          e Programa de Controle Médico
          de Saúde Ocupacional.
        </p>

      </header>


      <section
        className="
          rounded-xl
          border
          border-slate-700
          p-6
        "
      >

        <h2 className="mb-4 text-xl font-semibold">
          Documentação SST / PGR / PCMSO
        </h2>


        <SstCompanyLibraryManager
          embedded
        />

      </section>

    </div>

  );

}
