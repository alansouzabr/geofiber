"use client";


import {
  useState,
  useEffect
} from "react";

import dynamic from "next/dynamic";

import MobileToolbar
from "@/components/maps/MobileToolbar";

import Topbar
from "@/components/maps/layout/Topbar";

import LeftSidebar
from "@/components/maps/layout/LeftSidebar";

import RightSidebar
from "@/components/maps/layout/RightSidebar";

import ProjectsSidebar
from "@/components/maps/ProjectsSidebar";

import MapToolbar
from "@/components/maps/MapToolbar";

import AnalyticsPanel
from "@/components/maps/AnalyticsPanel";

import LayersPanel
from "@/components/maps/LayersPanel";

import PropertiesPanel
from "@/components/maps/PropertiesPanel";


import { getToken }
from "@/lib/api";

import {
  listProjectFolders
} from "@/lib/projectFolders";

import {
  ASSET_CATEGORIES
} from "@/components/maps/tree/assetCategories";

import FiberMenu
from "@/components/maps/FiberMenu";

import PoleMenu
from "@/components/maps/PoleMenu";

import AccessoryMenu
from "@/components/maps/AccessoryMenu";

import {
  updateFiberConnections
} from "@/components/maps/engine/liveNetwork";

import FiberRender
from "@/components/maps/render/FiberRender";

import {
  deletePole
} from "@/services/poles";

import {
  syncPoleCategory
} from "@/components/maps/tree/treeSyncEngine";

import {
  useTreeCrud
} from "@/components/maps/tree/useTreeCrud";

import {
  syncTreeAssets,
  findFolder,
  getAssetCategory,
  buildAssetNode
} from "@/components/maps/tree/treeSyncEngine";

const MapElementsRender = dynamic(
  () => import("@/components/maps/render/MapElementsRender"),
  { ssr: false }
);

const MapMarkersRender = dynamic(
  () => import("@/components/maps/render/MapMarkersRender"),
  { ssr: false }
);

const MapEvents = dynamic(
  () => import("@/components/maps/MapEvents"),
  { ssr: false }
);

import PoleAccessoryModal
from "@/components/maps/accessories/PoleAccessoryModal";

import createCTO
from "@/components/maps/modules/cto/services/createCTO";

const MapsClient = dynamic(
  () => import("@/components/maps/client/MapsClient"),
  { ssr: false }
);

const center:
  [number, number] =

  [-23.6914, -46.5646];


async function loadPolesFromApi() {

  const token = getToken();


  if (!token) {
    return [];
  }

  try {

    const res = await fetch(
      "https://api.geofibers.com.br/poles",
      {
        cache: "no-store",

        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache"
        }
      }
    );

    if (!res.ok) {
      throw new Error("API ERROR");
    }

    const poles = await res.json();

console.log(
  "API_POLES=",
  poles
);



    return poles.map((pole:any) => ({
      id: pole.id,
      name: pole.name,
      type: pole.type,
      folderId: pole.folderId || null,
      accessories: pole.accessories || [],
      connections: [],
      position: [
        pole.lat,
        pole.lng
      ]
    }));

  } catch (err) {

    console.error(
      "LOAD POLES ERROR",
      err
    );

    return [];
  }
}

export default function GeoFiberMaps() {

const {

    tree,

    setTree,

    addFolder,

    removeFolder,

    renameFolder,

    addSubfolder,

    toggleNodeVisibility,


  } = useTreeCrud();

  
const [
  dockVisible,
  setDockVisible
] = useState(true);

const [
  sidebarVisible,
  setSidebarVisible
] = useState(true);

const [
  poleMenuOpen,
  setPoleMenuOpen
] = useState(false);


const [
  fiberMenuOpen,
  setFiberMenuOpen
] = useState(false);

const [
  accessoryMenuOpen,
  setAccessoryMenuOpen
] = useState(false);

const [fiberType, setFiberType] =
  useState("12FO");


const [markers, setMarkers] =
    useState<any[]>([]);

const [ctos, setCtos] =
  useState<any[]>([]);

const assets = [

    ...markers

  ];


  const [
    currentFolder,
    setCurrentFolder
  ] = useState<any>(null);

  const [
    accessoryModalOpen,
        setAccessoryModalOpen
  ] = useState(false);



async function loadProjectTree() {

  try {

    const folders =
      await listProjectFolders();


    const nodesById:any = {};

    folders.forEach((f:any) => {

      nodesById[f.id] = {

        id: f.id,

        name: f.name,

        nodeType: f.nodeType,

        open: true,

        children: []
      };
    });

    const root:any[] = [];

    folders.forEach((f:any) => {

      const node =
        nodesById[f.id];

      if (f.parentId) {

        const parent =
          nodesById[f.parentId];

        if (parent) {
          parent.children.push(node);
        }

      } else {

        root.push(node);
      }
    });


    setTree(root);

  } catch(err) {

    console.error(
      "LOAD PROJECT TREE ERROR",
      err
    );
  }
}


/*
=================================
LOAD MARKERS
=================================
*/


useEffect(() => {

  if (!markers.length) {
    return;
  }

  setTree((prev:any[]) =>

    syncTreeAssets(

      prev,

      (cloned:any[]) => {

        buildAssets().forEach((m:any) => {

          const asset =
            buildAssetNode(m);

          const category =
            getAssetCategory(m.type);

          let folder = null;

          if (m.folderId) {

            folder =
              findFolder(
                cloned,
                m.folderId
              );

          }

          if (!folder) {

            let rootPostesCategory =
              cloned.find(
                (c:any)=>
                  c.nodeType===
                  category.rootNodeType
              );

            if (!rootPostesCategory) {

              rootPostesCategory = {

                id:
                  `root-${category.label.toLowerCase()}`,

                name:
                  category.label,

                nodeType:
                  category.rootNodeType,

                open:true,

                children:[]

              };

              cloned.push(
                rootPostesCategory
              );

            }

            rootPostesCategory.children.push(
              asset
            );

            rootPostesCategory.name =
              `${category.label} (${rootPostesCategory.children.length})`;

            return;

          }

          folder.children ??= [];

          syncPoleCategory(
            folder,
            asset,
            category
          );

        });

        return cloned;

      }

    )

  );

}, [markers]);



/*
=================================
SYNC FTTH TREE WITH MARKERS
=================================
*/

useEffect(() => {

  if (!markers.length) {
    return;
  }


  setTree((prev:any[]) =>

    syncTreeAssets(

      prev,

      (cloned:any[]) => {

    buildAssets().forEach((m:any) => {

      const asset =
        buildAssetNode(m);




        const category =
          getAssetCategory(m.type);

      let folder = null;

      if (m.folderId) {

        folder =
          findFolder(
            cloned,
            m.folderId
          );
      }

      
        if (!folder) {

          let rootPostesCategory =
            cloned.find(
              (c:any) =>
                c.nodeType ===
                category.rootNodeType
            );

          if (!rootPostesCategory) {

            rootPostesCategory = {

              id: `root-${category.label.toLowerCase()}`,

              name: category.label,

              nodeType:
                category.rootNodeType,

              open: true,

              children: []
            };

            cloned.push(
              rootPostesCategory
            );
          }

          rootPostesCategory.children.push(
            asset
          );

          rootPostesCategory.name =
            `${category.label} (${
              rootPostesCategory.children.length
            })`;

          return;
        }

        folder.children ??= [];

        syncPoleCategory(
          folder,
          asset,
          category
        );

    });

    return cloned;

    }

  )

    );

}, [markers]);


const [fiberDraft, setFiberDraft] =
  useState<any[]>([]);


  const [
    fiberStartPole,
    setFiberStartPole
  ] = useState<any>(null);

  const [
    selectedFiberColor,
    setSelectedFiberColor
  ] = useState(1);

  const [
    fiberLaunching,
    setFiberLaunching
  ] = useState(false);


const [fibers, setFibers] =


  useState<any[]>([]);

const liveFibers =
  updateFiberConnections(
    fibers,
    markers
  );


function buildAssets() {

  return [

    ...markers,

    ...liveFibers

  ];

}








const [

  selectedElement,

  setSelectedElement

] = useState<any>(
  null
);

const [

  selectedNodeId,

  setSelectedNodeId

] = useState<
  string | number | null
>(
  null
);

const [

  focusedNodeId,

  setFocusedNodeId

] = useState<
  string | number | null
>(
  null
);

/*
=================================
SELECTED TREE NODE
=================================
*/



const [

  contextMenu,

  setContextMenu

] = useState<any>(
  null
);


useEffect(() => {


}, [currentFolder]);


useEffect(() => {


}, [selectedNodeId]);

  useEffect(() => {

    async function boot() {

      await loadProjectTree();

      const poles = await loadPolesFromApi();

      console.log("INITIAL_POLES=", poles.length);

      setMarkers(poles);
    }

    boot();

  }, []);



const [tool, setTool]
 =


    useState("select");

useEffect(()=>{
  console.log("PAGE_TOOL=",tool);
},[tool]);


  const [
    selectedPole,
    setSelectedPole
  ] = useState<any>(null);

  
useEffect(()=>{

  if(

    selectedPole &&

    (tool==="CTO" || tool==="CEO")

  ){

    setAccessoryModalOpen(true);

  }

},[selectedPole,tool]);

const [layers, setLayers] =

    useState({

      postes: true,

      fibras: true,

      cto: true,

      clientes: true
    });

  return (

    <div
      className="
        fixed
        inset-0
        overflow-hidden
        bg-[#020817]
      "
    >

      
<MapsClient

  center={center}

  markers={markers}
    ctos={ctos}
    setCtos={setCtos}
  setMarkers={setMarkers}

  setSelectedElement={
    setSelectedElement
  }

  setContextMenu={
    setContextMenu
  }

  selectedNodeId={
    selectedNodeId
  }

  focusedNodeId={
    focusedNodeId
  }

  liveFibers={
    liveFibers
  }

  tool={tool}

    selectedPole={
      selectedPole
    }

    setSelectedPole={
      setSelectedPole
    }

      setAccessoryModalOpen={
        setAccessoryModalOpen
      }

  fiberDraft={
    fiberDraft
  }

  setFiberDraft={
    setFiberDraft
  }

  fibers={fibers}

  setFibers={
    setFibers
  }

  fiberType={
    fiberType
  }

  tree={tree}

  setTree={
    setTree
  }

  currentFolder={
    currentFolder
  }

/>


      <MobileToolbar />

      



<Topbar />

      <LeftSidebar>

        {sidebarVisible && (

        
<ProjectsSidebar

  tree={tree}

  setTree={setTree}

  addFolder={addFolder}

  removeFolder={removeFolder}

  renameFolder={renameFolder}

  addSubfolder={addSubfolder}

    toggleNodeVisibility={
      toggleNodeVisibility
    }
markers={markers}

    setMarkers={setMarkers}

    fibers={fibers}

    setFibers={setFibers}

  selectedNodeId={selectedNodeId}

  setSelectedNodeId={setSelectedNodeId}

  setFocusedNodeId={setFocusedNodeId}

  dockVisible={dockVisible}

  setDockVisible={setDockVisible}

  sidebarVisible={sidebarVisible}

  setSidebarVisible={setSidebarVisible}

    currentFolder={currentFolder}

    setCurrentFolder={setCurrentFolder}

    loadProjectTree={loadProjectTree}
/>


        )}

        





<PoleMenu

  open={poleMenuOpen}

  setOpen={
    setPoleMenuOpen
  }

  tool={tool}


  setTool={
    setTool
  }
/>


<FiberMenu

  open={fiberMenuOpen}

  fiberType={
    fiberType
  }

  setFiberType={
    setFiberType
  }


  tool={tool}


  setTool={
    setTool
  }
/>


<AccessoryMenu

  open={accessoryMenuOpen}

  setOpen={
    setAccessoryMenuOpen
  }

  tool={tool}


  setTool={
    setTool
  }
/>




{dockVisible && (

<MapToolbar

  tool={tool}


  setTool={setTool}

  poleMenuOpen={poleMenuOpen}

  setPoleMenuOpen={
    setPoleMenuOpen
  }

  fiberMenuOpen={
    fiberMenuOpen
  }

  setFiberMenuOpen={
    setFiberMenuOpen
  }

  accessoryMenuOpen={
    accessoryMenuOpen
  }

  setAccessoryMenuOpen={
    setAccessoryMenuOpen
  }

  fiberType={
    fiberType
  }

  setFiberType={
    setFiberType
  }

  setFiberLaunching={
    setFiberLaunching
  }

  setFiberStartPole={
    setFiberStartPole
  }


  sidebarVisible={
    sidebarVisible
  }

  setSidebarVisible={
    setSidebarVisible
  }

/>

)}



      </LeftSidebar>

      <RightSidebar>

        <AnalyticsPanel
          markers={markers}
          fibers={fibers}
        />

        <LayersPanel
          layers={layers}
          setLayers={setLayers}
        />

      </RightSidebar>

      {contextMenu && (

        <div
          className="
            fixed
            z-[999999]

            min-w-[180px]

            rounded-xl

            bg-[#0f172a]

            border
            border-white/10

            shadow-2xl

            overflow-hidden
          "
          style={{
            left: contextMenu.x,
            top: contextMenu.y
          }}
        >

          <button
            onClick={() => {

              setSelectedElement(
                contextMenu.marker
              );

              setContextMenu(
                null
              );
            }}

            className="
              w-full
              text-left

              px-4
              py-3

              text-white

              hover:bg-cyan-500/10
            "
          >
            Editar
          </button>

          <button
            onClick={async () => {

              const token =
                getToken();

              if (!token)
                return;

              await deletePole(
                token,
                String(
                  contextMenu.marker.id
                )
              );

              const apiMarkers =
                await loadPolesFromApi();

              setMarkers(
                apiMarkers
              );

              setContextMenu(
                null
              );
            }}

            className="
              w-full
              text-left

              px-4
              py-3

              text-red-400

              hover:bg-red-500/10
            "
          >
            Excluir
          </button>

        </div>

      )}

    
<PoleAccessoryModal

open={accessoryModalOpen}

pole={selectedPole}

onClose={()=>

setAccessoryModalOpen(false)

}

onSave={async(data)=>{

console.log(
"ACCESSORY_DATA",
data
);

const token=
localStorage.getItem("token");

const res=
await fetch(

process.env.NEXT_PUBLIC_API_URL+
"/pole-accessories",

{

method:"POST",

headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"application/json"
},

body:JSON.stringify(data)

}

);

if(!res.ok){

const err=await res.text();

console.error(err);

alert("Erro ao salvar acessório.");

return;

}

const accessory=
await res.json();

console.log(
"ACCESSORY_CREATED",
accessory
);

const cto=createCTO(
selectedPole
);

setCtos(prev=>[
...prev,
cto
]);



setAccessoryModalOpen(false);

}}

/>

</div>
  );
}
