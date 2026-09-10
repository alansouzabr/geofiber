import ExternalCourseButton
  from "@/components/training/buttons/ExternalCourseButton";

import TrainingLibraryManager
  from "@/components/training/TrainingLibraryManager";


export default function NormasRegulamentadorasPage() {

  return (

    <div className="space-y-8">

      <header>

        <h1 className="text-3xl font-bold">
          Normas Regulamentadoras
        </h1>

        <p className="mt-2 text-slate-400">
          Normas de segurança,
          requisitos regulatórios
          e materiais de apoio.
        </p>

      </header>


      <section
        className="
          rounded-xl
          border
          border-slate-700
          p-6
          space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Curso
        </h2>

        <p className="text-slate-400">
          Acesse o treinamento completo
          pela plataforma da empresa.
        </p>

        <ExternalCourseButton />

      </section>


      <section
        className="
          rounded-xl
          border
          border-slate-700
          p-6
        "
      >

        <h2 className="mb-4 text-xl font-semibold">
          Material de Normas Regulamentadoras
        </h2>


        <TrainingLibraryManager
          defaultCategory="Treinamento NR"
            allowedCategories={["Treinamento NR"]}
          embedded
          showFilters={false}
        />

      </section>

    </div>

  );

}
