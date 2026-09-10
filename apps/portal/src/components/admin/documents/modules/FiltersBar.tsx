import { getCategories } from "../constants/getCategories";

interface Props {

  filterCategory: string;

  setFilterCategory: any;

  mode?: "ged" | "training";
}

export default function FiltersBar({

  filterCategory,

  setFilterCategory,

  mode="ged"

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

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >

        <select
          value={filterCategory}
          onChange={e =>
            setFilterCategory(
              e.target.value
            )
          }
          className="
            bg-slate-950
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
          "
        >

          <option value="">
            Todas categorias
          </option>
          {getCategories(mode).map(category => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}

        </select>

      </div>

    </div>
  );
}
