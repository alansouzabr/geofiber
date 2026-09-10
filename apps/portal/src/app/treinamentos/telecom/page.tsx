import ExternalCourseButton
from "@/components/training/buttons/ExternalCourseButton";

import TrainingLibraryManager
from "@/components/training/TrainingLibraryManager";

// ETAPA34B11_TELECOM_GLOBAL_LIBRARY
export default function NocTrainingPage() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          TI / Redes / Telecom
        </h1>

        <p className="text-slate-400 mt-2">
          Biblioteca técnica para equipes de NOC.
        </p>

      </div>

      <div
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
          Acesse o treinamento completo pela plataforma da empresa.
        </p>

        <ExternalCourseButton />

      </div>

      <div
        className="
          rounded-xl
          border
          border-slate-700
          p-6
        "
      >

        <h2 className="text-xl font-semibold mb-4">
          Biblioteca Técnica
        </h2>

        <TrainingLibraryManager
          defaultCategory="Treinamento TI / Redes / Telecom"
          allowedCategories={["Treinamento TI / Redes / Telecom"]}
          embedded
          showFilters={false}
        />

      </div>

    </div>

  );

}
