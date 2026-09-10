"use client";

const fibers = [

  "12FO",
  "24FO",
  "36FO",
  "72FO",
  "144FO"
];

interface Props {

  value: string;

  onChange: (
    value: string
  ) => void;
}

export default function FiberTypeSelector({
  value,
  onChange
}: Props) {

  return (

    <select
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }

      className="
        w-full
        bg-slate-900
        border
        border-slate-700
        rounded-xl
        px-4
        py-3
        text-white
      "
    >

      {fibers.map((fiber) => (

        <option
          key={fiber}
          value={fiber}
        >
          {fiber}
        </option>
      ))}

    </select>
  );
}
