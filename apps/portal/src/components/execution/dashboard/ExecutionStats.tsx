const cards = [
  ["OS Hoje", "0"],
  ["Em Execução", "0"],
  ["Concluídas", "0"],
  ["Técnicos", "0"],
  ["Equipes", "0"]
];

export default function ExecutionStats() {
  return (
    <div className="grid grid-cols-5 gap-4">

      {cards.map(([titulo, valor]) => (

        <div
          key={titulo}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5"
        >

          <div className="text-sm text-slate-400">
            {titulo}
          </div>

          <div className="mt-2 text-3xl font-bold text-white">
            {valor}
          </div>

        </div>

      ))}

    </div>
  );
}
