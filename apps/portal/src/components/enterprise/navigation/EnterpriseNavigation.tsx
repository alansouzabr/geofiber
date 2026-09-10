"use client";

import { enterpriseNavigation } from "./enterpriseNavigation";

interface Props {
  tab: string;
  setTab: (tab: string) => void;
  onNavigate?: () => void;
}

export default function EnterpriseNavigation({
  tab,
  setTab,
  onNavigate
}: Props) {

  return (

    <nav
      className="
        flex
        flex-col
        gap-2
        flex-1
      "
    >

      {enterpriseNavigation.map((item) => {

        const Icon = item.icon;

        const active =
          tab === item.tab;

        return (

          <button
            key={item.tab}
            onClick={() => {
              setTab(item.tab);
              onNavigate?.();
            }}
            className={`
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all

              ${
                active
                  ? "bg-cyan-500 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }
            `}
          >

            <Icon size={18} />

            <span>
              {item.label}
            </span>

          </button>

        );

      })}

    </nav>

  );

}
