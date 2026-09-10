import { StructureNode } from "./StructureTypes";

function createNode(item:any):StructureNode{

  return{

    id:String(item.id),

    type:
      item.type ??
      item.accessoryType ??
      "UNKNOWN",

    name:
      item.name ??
      item.label ??
      item.type ??
      item.accessoryType ??
      "Equipamento",

    children:[]

  };

}

export function buildPoleStructure(
  pole:any
):StructureNode[]{

  const root:StructureNode={

    id:String(pole.id),

    type:pole.type,

    name:pole.name,

    children:[]

  };

  const accessories=pole.accessories ?? [];

  const ctos:StructureNode[]=[];
  const ceos:StructureNode[]=[];
  const others:StructureNode[]=[];

  for(const accessory of accessories){

    const node=createNode(accessory);

    switch(node.type){

      case "CTO":
        ctos.push(node);
        break;

      case "CEO":
        ceos.push(node);
        break;

      default:
        others.push(node);
        break;

    }

  }

  root.children!.push(...ctos);
  root.children!.push(...ceos);
  root.children!.push(...others);

  return [root];

}
