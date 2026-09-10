import Link from "next/link";

const modules = [
  {
    title: "ANATEL",
    href: "/arquivos/anatel",
    description: "Licenças, SCM, STFC, Outorgas"
  },
  {
    title: "TRT",
    href: "/arquivos/cft",
    description: "Documentação Trabalhista"
  },
  {
    title: "ART",
    href: "/arquivos/crea",
    description: "ART, CREA, Responsabilidade Técnica"
  },
  {
    title: "DWG",
    href: "/arquivos/dwg",
    description: "Projetos AutoCAD"
  },
  {
    title: "KMZ",
    href: "/arquivos/kmz",
    description: "Google Earth / Georreferenciamento"
  },
  {
    title: "DOCUMENTOS",
    href: "/arquivos/documentos",
    description: "Contratos, PDFs e Arquivos Gerais"
  }
];

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        GED Enterprise
      </h1>

      <p className="text-gray-500 mb-8">
        Gerenciamento Eletrônico de Documentos
      </p>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              {module.title}
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {module.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
