import UploadZone from "./upload/UploadZone";
import MonthSelect from "./selects/MonthSelect";
import { getCategories } from "../constants/getCategories";

interface Props {

  companies: any[];

  selectedCompany: string;

  setSelectedCompany: any;

  month: string;

  setMonth: any;

  category: string;

  setCategory: any;

  setFile: any;

  upload: any;

  loading: boolean;

  loadFiles: any;

  canUpload?: boolean;

  mode?: "ged" | "training";
}

export default function UploadPanel({

  companies,

  selectedCompany,

  setSelectedCompany,

  month,

  setMonth,

  category,

  setCategory,

  setFile,

  upload,

  loading,

  loadFiles,

  canUpload=true,

  mode="ged"

}: Props) {

  console.log("UPLOAD_MODE =", mode);
  console.log("UPLOAD_CATEGORY =", category);
  console.log("UPLOAD_OPTIONS =", getCategories(mode));

  if (!canUpload) {
    return null;
  }

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
      "
    >
      

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        <select
          value={selectedCompany}
          onChange={e => {

            setSelectedCompany(
              e.target.value
            );

            loadFiles(
              e.target.value
            );
          }}
          className="
            bg-slate-950
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            w-full
          "
        >

          {companies.map(company => (

            <option
              key={company.id}
              value={company.id}
            >
              {company.name}
            </option>

          ))}

        </select>

        <MonthSelect
          month={month}
          setMonth={setMonth}
        />

        <select
          value={category}
          onChange={e =>
            setCategory(
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
            w-full
          "
        >
          {getCategories(mode).map(category => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}

        </select>

        <div className="md:col-span-2 xl:col-span-2">

          <UploadZone
            setFile={setFile}
          />

        </div>

        <button
          onClick={upload}
          disabled={loading}
          className="
            bg-cyan-500
            hover:bg-cyan-400
            transition
            text-slate-950
            rounded-xl
            px-6
            py-3
            font-bold
            w-full
          "
        >
          {loading
            ? "Enviando..."
            : "Upload"}
        </button>

      </div>

    </div>
  );
}
