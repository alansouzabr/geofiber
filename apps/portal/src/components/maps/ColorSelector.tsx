"use client";

const colors = [

  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#eab308",
  "#a855f7",
  "#f97316"
];

interface Props {

  value: string;

  onChange: (
    color: string
  ) => void;
}

export default function ColorSelector({
  value,
  onChange
}: Props) {

  return (

    <div
      className="
        flex
        gap-2
        flex-wrap
      "
    >

      {colors.map((color) => (

        <button
          key={color}
          onClick={() => onChange(color)}
          className="
            w-7
            h-7
            rounded-full
            border-2
          "
          style={{

            background: color,

            borderColor:
              value === color
                ? "white"
                : "transparent"
          }}
        />
      ))}

    </div>
  );
}
