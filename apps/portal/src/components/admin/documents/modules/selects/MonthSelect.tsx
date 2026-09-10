interface Props {

  month: string;

  setMonth: any;
}

const months = [

  {
    value: "01-janeiro",
    label: "Janeiro"
  },

  {
    value: "02-fevereiro",
    label: "Fevereiro"
  },

  {
    value: "03-marco",
    label: "Março"
  },

  {
    value: "04-abril",
    label: "Abril"
  },

  {
    value: "05-maio",
    label: "Maio"
  },

  {
    value: "06-junho",
    label: "Junho"
  },

  {
    value: "07-julho",
    label: "Julho"
  },

  {
    value: "08-agosto",
    label: "Agosto"
  },

  {
    value: "09-setembro",
    label: "Setembro"
  },

  {
    value: "10-outubro",
    label: "Outubro"
  },

  {
    value: "11-novembro",
    label: "Novembro"
  },

  {
    value: "12-dezembro",
    label: "Dezembro"
  }
];

export default function MonthSelect({

  month,

  setMonth

}: Props) {

  return (

    <select
      value={month}
      onChange={e =>
        setMonth(
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

      {months.map(month => (

        <option
          key={month.value}
          value={month.value}
        >
          {month.label}
        </option>

      ))}

    </select>
  );
}
