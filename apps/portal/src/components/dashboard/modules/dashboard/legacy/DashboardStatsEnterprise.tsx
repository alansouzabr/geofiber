"use client";

interface Props{
  company:any;
}

const cards=(company:any)=>[

{
title:"Empresa",
value:company?.name || "-",
color:"#22d3ee"
},

{
title:"Plano",
value:company?.plan?.name || "Enterprise",
color:"#4ade80"
},

{
title:"Usuários",
value:"1 / 50",
color:"#a78bfa"
},

{
title:"Status",
value:company?.isActive ? "ATIVA" : "PENDENTE",
color:company?.isActive ? "#22c55e" : "#f59e0b"
}

];

export default function DashboardStatsEnterprise({

company

}:Props){

return(

<section
className="
mt-8
grid
gap-6
sm:grid-cols-2
xl:grid-cols-4
"
>

{

cards(company).map(card=>(

<div

key={card.title}

className="
rounded-2xl
border
border-slate-800
bg-[#081223]
p-6
transition-all
duration-300
hover:border-slate-600
"

>

<div
className="
text-sm
text-slate-400
"
>

{card.title}

</div>

<div

className="
mt-3
text-3xl
font-bold
"

style={{
color:card.color
}}

>

{card.value}

</div>

</div>

))

}

</section>

);

}
