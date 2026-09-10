"use client";

export default function SettingsMenu({
  active,
  onChange
}:{
  active:string;
  onChange:(v:string)=>void;
}){

  const items=[
    ["usuarios","Usuários"],
    ["tecnicos","Técnicos"],
    ["equipes","Equipes"],
    ["permissoes","Permissões"],
    ["integracoes","Integrações"]
  ];

  return(

    <div className="flex gap-2 mb-6 flex-wrap">

      {items.map(([id,label])=>(

        <button
          key={id}
          onClick={()=>onChange(id)}
          className={
            active===id
            ? "px-4 py-2 rounded-lg bg-cyan-600 text-white"
            : "px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
          }
        >

          {label}

        </button>

      ))}

    </div>

  );

}
