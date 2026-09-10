"use client";

export default function HeroLastAccess() {
  return (
    <div
      className="
        rounded-xl
        border
        border-slate-700
        px-5
        py-4
      "
    >
      <div
        className="
          text-xs
          uppercase
          tracking-widest
          text-slate-400
        "
      >
        Último acesso
      </div>

      <div
        className="
          mt-2
          text-lg
          font-semibold
          text-white
        "
      >
        Agora
      </div>
    </div>
  );
}
