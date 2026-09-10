import TimelineMonth from "./TimelineMonth";

const months = [

  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

export default function TimelineYear() {

  return (

    <div
      className="
        space-y-6
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-black
            text-white
          "
        >
          Timeline 2026
        </h1>

        <p
          className="
            text-slate-400
            mt-2
          "
        >
          Organização mensal enterprise
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        {months.map(month => (

          <TimelineMonth
            key={month}
            month={month}
            total={0}
          />

        ))}

      </div>

    </div>
  );
}
