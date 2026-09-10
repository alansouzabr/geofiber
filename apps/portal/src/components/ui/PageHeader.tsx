interface Props {

  title: string;

  subtitle?: string;

  right?: React.ReactNode;

}

export default function PageHeader({

  title,

  subtitle,

  right

}: Props) {

  return (

    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-6
        mb-8
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {title}
        </h1>

        {subtitle && (

          <p
            className="
              mt-2
              text-slate-400
            "
          >
            {subtitle}
          </p>

        )}

      </div>

      {right && (

        <div
          className="
            flex
            gap-3
            flex-wrap
          "
        >

          {right}

        </div>

      )}

    </div>

  );

}
