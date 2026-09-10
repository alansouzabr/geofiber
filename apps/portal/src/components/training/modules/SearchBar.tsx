interface Props {

  search: string;

  setSearch: any;
}

export default function SearchBar({
  search,
  setSearch
}: Props) {

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-4
      "
    >
      <input
        type="text"
        placeholder="Buscar documentos..."
        value={search}
        onChange={e =>
          setSearch(
            e.target.value
          )
        }
        className="
          w-full
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          px-4
          py-3
          text-white
          outline-none
        "
      />

    </div>
  );
}
