/*
 * ETAPA32C2_EXTERNAL_PORTAL
 *
 * Atalho visual para sistemas externos oficiais.
 * Mantém o usuário dentro da rota GeoFiber e
 * abre o sistema externo somente por ação explícita.
 */

type Props = {
  title: string;
  description: string;
  url: string;
  buttonLabel?: string;
};


export default function ExternalPortalShortcut({
  title,
  description,
  url,
  buttonLabel = "Acessar portal oficial",
}: Props) {

  return (
    <section
      className="
        mb-6
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/70
        p-5
      "
    >

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <div
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-cyan-400
            "
          >
            Portal externo
          </div>

          <h2
            className="
              mt-1
              text-lg
              font-bold
              text-white
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              max-w-3xl
              text-sm
              text-slate-400
            "
          >
            {description}
          </p>

        </div>


        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            min-h-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-cyan-500
            px-5
            py-2.5
            text-sm
            font-bold
            text-slate-950
            transition
            hover:bg-cyan-400
          "
        >
          {buttonLabel}
          <span
            aria-hidden="true"
            className="ml-2"
          >
            ↗
          </span>
        </a>

      </div>

    </section>
  );
}
