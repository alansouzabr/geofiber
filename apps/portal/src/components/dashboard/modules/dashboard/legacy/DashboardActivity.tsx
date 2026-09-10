"use client";

const activities = [

{
title:"Projetos",
description:"Nenhuma atividade recente."
},

{
title:"Arquivos",
description:"Nenhum download recente."
},

{
title:"Usuários",
description:"Nenhuma alteração cadastrada."
},

{
title:"Financeiro",
description:"Sem movimentações."
}

];

export default function DashboardActivity(){

return(

<section
className="
mt-8
rounded-3xl
border
border-slate-800
bg-[#081223]
p-8
"
>

<h2
className="
text-2xl
font-bold
text-white
"
>

Atividades Recentes

</h2>

<div
className="
mt-6
space-y-4
"
>

{

activities.map(item=>(

<div

key={item.title}

className="
rounded-xl
border
border-slate-800
bg-[#0b1728]
p-5
"

>

<h3
className="
font-semibold
text-cyan-400
"
>

{item.title}

</h3>

<p
className="
mt-2
text-slate-400
"
>

{item.description}

</p>

</div>

))

}

</div>

</section>

);

}
