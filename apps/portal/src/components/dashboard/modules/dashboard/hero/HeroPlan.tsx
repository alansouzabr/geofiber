"use client";

interface Props{
  company:any;
}

export default function HeroPlan({

  company

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
        Plano
      </div>

      <div
        className="
          mt-2
          text-lg
          font-semibold
          text-cyan-400
        "
      >
        {company?.plan?.name || "Enterprise"}
      </div>

    </div>

  );

}
