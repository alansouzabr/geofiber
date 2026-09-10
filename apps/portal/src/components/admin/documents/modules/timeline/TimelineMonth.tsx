interface Props {

  month: string;

  total: number;
}

export default function TimelineMonth({

  month,

  total

}: Props) {

  return (

    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-5
        hover:border-cyan-500
        transition-all
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-lg
              font-bold
              text-white
            "
          >
            {month}
          </h2>

          <p
            className="
              text-sm
              text-slate-400
              mt-1
            "
          >
            Timeline mensal
          </p>

        </div>

        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-cyan-500/10
            flex
            items-center
            justify-center
            text-cyan-400
            font-black
            text-lg
          "
        >
          {total}
        </div>

      </div>

    </div>
  );
}
