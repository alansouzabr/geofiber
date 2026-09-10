"use client";

type Props = {
  tab: string;
  setTab: (tab: string) => void;
};

const items = [
  ["dashboard","Dashboard"],
  ["orders","Ordens"],
  ["technicians","Técnicos"],
  ["teams","Equipes"],
  ["calendar","Agenda"],
  ["reports","Relatórios"],
];

export default function ExecutionMenu({
  tab,
  setTab
}: Props) {

  return (

    <div className="flex flex-wrap gap-3">

      {items.map(([id,label]) => (

        <button
          key={id}
          onClick={() => setTab(id)}
          className={
            tab===id
              ? "rounded-lg bg-cyan-500 px-4 py-2 text-white"
              : "rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
          }
        >
          {label}
        </button>

      ))}

    </div>

  );

}
