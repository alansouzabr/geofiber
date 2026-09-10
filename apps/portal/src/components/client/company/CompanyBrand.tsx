interface Props {
  company?: any;
  compact?: boolean;
}

export default function CompanyBrand({
  company,
  compact = false
}: Props) {

  const letter =
    company?.name?.charAt(0)?.toUpperCase() || "E";

  return (

    <div
      className="
        flex
        items-center
        gap-3
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-2xl
          bg-cyan-600
          flex
          items-center
          justify-center
          text-white
          font-bold
          text-lg
        "
      >
        {letter}
      </div>

      {!compact && (

        <div>

          <div
            className="
              text-white
              font-bold
            "
          >
            {company?.name || "Empresa"}
          </div>

          <div
            className="
              text-xs
              text-slate-400
            "
          >
            {company?.plan || "Portal Enterprise"}
          </div>

        </div>

      )}

    </div>

  );
}
