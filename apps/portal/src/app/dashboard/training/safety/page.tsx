import Link from "next/link";

export default function SafetyTrainingPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Segurança do Trabalho
        </h1>

        <p className="text-gray-500 mt-2">
          Cursos e treinamentos relacionados às Normas Regulamentadoras.
        </p>
      </div>

      <Link
        href="/seg/treinamentos"
        className="
          block
          rounded-xl
          border
          p-6
          hover:shadow-lg
          transition
        "
      >
        <h2 className="text-xl font-semibold">
          Normas Regulamentadoras
        </h2>

        <p className="mt-2 text-gray-500">
          NR10, NR35, procedimentos de segurança e documentos oficiais.
        </p>
      </Link>

    </div>
  );
}
