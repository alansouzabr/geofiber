"use client";

import {
  Map,
  Cloud,
  MapPinned
} from "lucide-react";

const items=[

{
icon:<Map size={46} className="text-cyan-400" />,
title:"Plataforma KMZ",
text:"Geração automática de postes e rotas para Google Earth."
},

{
icon:<Cloud size={46} className="text-green-400" />,
title:"GeoFiber GED",
text:"Armazenamento seguro e organizado dos seus arquivos."
},

{
icon:<MapPinned size={46} className="text-violet-400" />,
title:"GeoFiber Maps",
text:"Planejamento e documentação completa da rede óptica."
}

];

export default function PlatformInfo(){

return(

<section
className="
mt-8
rounded-3xl
border
border-slate-700
bg-[#081223]
overflow-hidden
"
>

<div
className="
px-8
pt-7
pb-2
"
>

<h2
className="
text-2xl
font-bold
text-cyan-400
"
>

Sobre as Plataformas

</h2>

</div>

<div
className="
grid
lg:grid-cols-3
"
>

{

items.map((item,index)=>(

<div

key={item.title}

className={`
flex
items-start
gap-5
px-8
py-8
${index>0?"border-l border-slate-700":""}
`}

>

<div>

{item.icon}

</div>

<div>

<h3
className="
text-2xl
font-bold
"
>

{item.title}

</h3>

<p
className="
mt-3
text-slate-300
leading-7 text-sm
"
>

{item.text}

</p>

</div>

</div>

))

}

</div>

</section>

);

}
