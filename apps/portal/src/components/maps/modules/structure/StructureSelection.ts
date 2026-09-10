export type StructureSelection={

  id:string|null;

};

let selectedId:string|null=null;

const listeners=new Set<
  (id:string|null)=>void
>();

export function getSelectedNode(){

  return selectedId;

}

export function setSelectedNode(
  id:string|null
){

  selectedId=id;

  for(const fn of listeners){

    fn(id);

  }

}

export function subscribeSelection(
  fn:(id:string|null)=>void
){

  listeners.add(fn);

  return ()=>{

    listeners.delete(fn);

  };

}
