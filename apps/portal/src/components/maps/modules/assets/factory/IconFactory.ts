import {

getPoleConcreteIcon,

getPoleMetalIcon,

getCtoIcon,

getSpliceIcon,

getClientIcon

} from "@/components/maps/mapIcons";

export default function IconFactory(

type:string

){

switch(type){

case "POSTE_CONCRETO":

return getPoleConcreteIcon();

case "POSTE_METALICO":

return getPoleMetalIcon();

case "CTO":

case "CTO_8":

case "CTO_16":

case "CTO_32":

case "CTO_64":

return getCtoIcon();

case "CEO":

return getSpliceIcon();

case "CLIENTE":

case "CLIENTE_RESIDENCIAL":

case "CLIENTE_EMPRESARIAL":

return getClientIcon();

default:

return getClientIcon();

}

}
