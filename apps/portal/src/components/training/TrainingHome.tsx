import ExternalCourseButton
from "./buttons/ExternalCourseButton";

import TrainingCard
from "./cards/TrainingCard";

export default function TrainingHome() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Treinamentos

        </h1>

        <p className="mt-2 text-slate-400">

          Biblioteca técnica da empresa.

        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <TrainingCard

          title="Segurança do Trabalho"

          description="Normas Regulamentadoras e documentação de segurança."

          href="/seg/treinamentos"

        />

        <TrainingCard

          title="NOC"

          description="TI, Redes, Telecom, Backbone e Infraestrutura."

          href="/telecom/treinamentos"

        />

      </div>

      <div
        className="
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          p-6
        "
      >

        <h2 className="text-xl font-semibold">

          Plataforma de Cursos Online

        </h2>

        <p className="mt-3 text-slate-400">

          Acesse os cursos completos em vídeo do Instituto
          Atilan Souza.

        </p>

        <ExternalCourseButton />

      </div>

    </div>

  );

}
