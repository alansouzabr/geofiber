export default function ExecutionToolbar() {
  return (
    <div className="flex flex-wrap gap-3">

      <button className="rounded bg-cyan-500 px-4 py-2 text-white">
        Nova Ordem
      </button>

      <button className="rounded bg-slate-700 px-4 py-2 text-white">
        Técnicos
      </button>

      <button className="rounded bg-slate-700 px-4 py-2 text-white">
        Equipes
      </button>

      <button className="rounded bg-slate-700 px-4 py-2 text-white">
        Agenda
      </button>

    </div>
  );
}
