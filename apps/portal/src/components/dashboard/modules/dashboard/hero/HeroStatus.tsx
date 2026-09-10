"use client";

interface Props{
  active?:boolean;
}

export default function HeroStatus({

  active

}:Props){

  return(

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
        Status
      </div>

      <div
        className="
          mt-2
          text-lg
          font-semibold
        "
        style={{
          color:active
            ? "#22c55e"
            : "#f59e0b"
        }}
      >
        {active ? "Empresa Ativa" : "Aguardando Aprovação"}
      </div>

    </div>

  );

}
