"use client";

import Link from "next/link";

const modules = [

{
title:"Projetos",
href:"/projetos",
description:"Mapas, KMZ, FTTH e Backbone"
},

{
title:"Execução",
href:"#",
description:"Ordens, equipes e checklist"
},

{
title:"Arquivos",
href:"/arquivos",
description:"Downloads e documentos"
},

{
title:"Empresa",
href:"/usuarios",
description:"Usuários e permissões"
},

{
title:"Financeiro",
href:"/financeiro",
description:"Plano, PIX e Stripe"
},

{
title:"Configurações",
href:"#",
description:"Preferências da plataforma"
}

];

export default function QuickModules(){

return(

<section
className="
mt-8
grid
gap-6
md:grid-cols-2
xl:grid-cols-3
"
>

{

modules.map(item=>(

<Link

key={item.title}

href={item.href}

className="
rounded-2xl
border
border-slate-800
bg-[#081223]
p-6
transition-all
duration-300
hover:border-cyan-500
hover:-translate-y-1
block
"

>

<h3
className="
text-xl
font-bold
text-white
"
>

{item.title}

</h3>

<p
className="
mt-3
text-sm
leading-7
text-slate-400
"
>

{item.description}

</p>

</Link>

))

}

</section>

);

}
