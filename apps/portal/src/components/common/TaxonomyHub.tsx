import Link from "next/link";

export type TaxonomyHubItem = {
  title: string;
  href: string;
  description: string;
};

type Props = {
  title: string;
  description: string;
  items: TaxonomyHubItem[];
};

export default function TaxonomyHub({
  title,
  description,
  items
}: Props) {

  return (
    <main
      className="
        min-h-screen
        bg-slate-950
        px-6
        py-10
        text-white
      "
    >
      <div className="mx-auto max-w-6xl">

        <header className="mb-10">

          <h1
            className="
              text-3xl
              font-black
              tracking-tight
            "
          >
            {title}
          </h1>

          <p
            className="
              mt-3
              max-w-3xl
              leading-7
              text-slate-400
            "
          >
            {description}
          </p>

        </header>


        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {items.map((item) => (

            <Link
              key={item.href}
              href={item.href}
              className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-900
                p-6
                transition
                hover:border-cyan-500
                hover:bg-slate-900/80
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-cyan-400
                "
              >
                {item.title}
              </h2>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-slate-400
                "
              >
                {item.description}
              </p>

            </Link>

          ))}

        </div>

      </div>
    </main>
  );
}
