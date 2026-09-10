
"use client";

import {
  useState,
  useEffect
} from "react";


import {
  Search,
  FolderGit2,
  Plus,

  ArrowLeft,
  ArrowRight,
  Home,
  PanelsTopLeft,
  Eye,
  EyeOff
} from "lucide-react";

import TreeItem
from "@/components/maps/tree/TreeItem";

import DraggablePanel
from "@/components/maps/floating/DraggablePanel";

import {
  createProjectFolder
} from "@/lib/projectFolders";




interface Props {

  tree: any[];

  setTree: any;

  addFolder: any;

  removeFolder: any;

  renameFolder: any;

  addSubfolder: any;

    toggleNodeVisibility: any;

    markers: any[];

    setMarkers: any;

  fibers: any[];

  setFibers: any;

  dockVisible: boolean;

  setDockVisible: (
    value: boolean
  ) => void;

  sidebarVisible: boolean;

  setSidebarVisible: (
    value: boolean
  ) => void;

  selectedNodeId:
    string | number | null;

  setSelectedNodeId:
      (id: string | number | null)
      => void;

  setFocusedNodeId:
      (id: string | number | null)
      => void;

    currentFolder: any;

    setCurrentFolder: any;

    loadProjectTree: any;
}



export default function ProjectsSidebar({

  tree,

  setTree,

  addFolder,

  removeFolder,

  renameFolder,

  addSubfolder,

    toggleNodeVisibility,

    markers,

    setMarkers,

      fibers,

      setFibers,

  dockVisible,

  setDockVisible,

  selectedNodeId,

  setSelectedNodeId,

  setFocusedNodeId,

    currentFolder,

    setCurrentFolder,

    loadProjectTree

  }: Props) {


  

  const [

    history,

    setHistory

  ] = useState<any[]>([]);

  const [

    historyIndex,

    setHistoryIndex

  ] = useState(-1);

  const [

    currentPath,



    setCurrentPath

  ] = useState<any[]>([]);

  /*
  ==================================
  TREE SYNC
  ==================================
  */

  useEffect(() => {

    if (!currentFolder)
      return;

    function findFolder(
      nodes: any[],
      id: string | number
    ): any {

      for (const node of nodes) {

        if (node.id === id)
          return node;

        if (node.children) {

          const found =
            findFolder(
              node.children,
              id
            );

          if (found)
            return found;
        }
      }

      return null;
    }

    const updatedFolder =

      findFolder(
        tree,
        currentFolder.id
      );

    console.log(
      "SYNC_FOLDER",
      currentFolder?.id,
      currentFolder?.name,
      !!updatedFolder
    );

    if (updatedFolder) {

      setCurrentFolder(
        updatedFolder
      );

    } else if (

      currentFolder?.nodeType ===
        "ROOT_POSTES_CATEGORY" ||

      currentFolder?.nodeType ===
        "ROOT_FIBRAS_CATEGORY" ||

      currentFolder?.nodeType ===
        "ROOT_ACESSORIOS_CATEGORY" ||

      currentFolder?.nodeType ===
        "ROOT_GRUPOS_CATEGORY" ||

      currentFolder?.nodeType ===
        "ROOT_ESTACOES_CATEGORY" ||

      currentFolder?.nodeType ===
        "ROOT_RACKS_CATEGORY" ||

      currentFolder?.nodeType ===
        "ROOT_OTDR_CATEGORY"

    ) {

      const refreshedVirtual =

        tree.find(
          (item:any) =>
            item.nodeType ===
            currentFolder?.nodeType
        );

      console.log(
        "KEEP_VIRTUAL_CATEGORY",
        currentFolder?.name,
        "REFRESHED=",
        refreshedVirtual?.name
      );

      if (refreshedVirtual) {

        setCurrentFolder(
          refreshedVirtual
        );

        const pathResult =
          buildPath(
            tree,
            refreshedVirtual.id
          );

        setCurrentPath(
          (pathResult || []).filter(
            (item:any) =>
              item.id !== 1
          )
        );
      }

    } else {

      console.log(
        "FOLDER_REMOVED_RESET_VIEW",
        currentFolder?.id
      );

      setCurrentFolder(null);

      setCurrentPath([]);
    }

  }, [

    tree,

    currentFolder
  ]);

  

  function openFolder(
    folder: any
  ) {

    console.log(
      "OPEN_FOLDER",
      folder?.id,
      typeof folder?.id,
      folder?.name
    );

    setCurrentFolder(
      folder
    );

    const pathResult = buildPath(tree, folder.id);

      setCurrentPath((pathResult || []).filter((item:any) => item.id !== 1));

    setHistory((prev) => {

      const cleanHistory =
        prev.slice(
          0,
          historyIndex + 1
        );

      const next = [
        ...cleanHistory,
        folder
      ];

      console.log(
        "HISTORY_PUSH",
        next.map(
          (x:any) => x.name
        )
      );

      return next;
    });

    setHistoryIndex((prev) => {

      console.log(
        "SET_HISTORY_INDEX",
        prev,
        "->",
        prev + 1
      );

      return prev + 1;
    });
  }

  function goRoot() {

    setCurrentFolder(
      null
    );

    setCurrentPath([]);
    }


    function showAllItems() {

      setMarkers(
        (prev:any[]) =>
          prev.map(
            item => ({
              ...item,
              hidden:false
            })
          )
      );
    }

    function hideAllItems() {

      setMarkers(
        (prev:any[]) =>
          prev.map(
            item => ({
              ...item,
              hidden:true
            })
          )
      );
    }

  function goBack() {

    console.log(
      "GO_BACK",
      {
        historyIndex,
        historyLength: history.length,
        history
      }
    );

    if (
      historyIndex <= 0
    ) {

      console.log(
        "GO_ROOT_FROM_HISTORY"
      );

      setCurrentFolder(null);

      setCurrentPath([]);

      setHistoryIndex(-1);

      return;
    }

    const prevFolder =

      history[
        historyIndex - 1
      ];

    setCurrentFolder(
      prevFolder
    );

    const pathResult =

      buildPath(
        tree,
        prevFolder.id
      );

    setCurrentPath(
      (pathResult || []).filter(
        (item:any) => item.id !== 1
      )
    );

    setHistoryIndex(
      historyIndex - 1
    );
  }

  function goForward() {

    if (
      historyIndex >=
      history.length - 1
    ) {

      return;
    }

    const nextFolder =

      history[
        historyIndex + 1
      ];

    setCurrentFolder(
      nextFolder
    );

    const pathResult =

      buildPath(
        tree,
        nextFolder.id
      );

    setCurrentPath(
      (pathResult || []).filter(
        (item:any) => item.id !== 1
      )
    );

    setHistoryIndex(
      historyIndex + 1
    );
  }

  function findNodeById(
    items: any[],
    id: string | number
  ): any {

    for (const item of items) {

      if (
        item.id === id
      ) {

        return item;
      }

      if (
        item.children
      ) {

        const found =
          findNodeById(
            item.children,
            id
          );

        if (found) {

          return found;
        }
      }
    }

    return null;
  }

  function buildPath(
    items: any[],
    targetId: string | number,
    path: any[] = []
  ): any[] | null {

    for (const item of items) {

      const currentPath = [

        ...path,

        item
      ];

      if (
        item.id === targetId
      ) {

        return currentPath;
      }

      if (
        item.children
      ) {

        const found =

          buildPath(
            item.children,
            targetId,
            currentPath
          );

        if (found) {

          return found;
        }
      }
    }

    return null;
  }


  


return (

    <DraggablePanel

      title="Projetos FTTH"

      initialX={-6}

      initialY={-35}

      initialWidth={320}

      initialHeight={575}
    >

      <div
        className="
          h-full

          flex
          flex-col

          bg-[#0b1220]/96

          overflow-hidden

          rounded-2xl
        "
      >

        <div
          className="
            p-3

            border-b
            border-white/5
          "
        >

          <div
            className="
              flex
              items-center
              justify-between

              mb-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <FolderGit2
                size={16}
                className="text-cyan-400"
              />

              <span
                className="
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Projetos FTTH
              </span>

            </div>

            <button

              onClick={async () => {

                try {

                  await createProjectFolder({

                    projectId:
                      "c9617be4-c43a-46c2-820a-4e479da8fca1",

                    parentId:
                      currentFolder?.id || null,

                    name:
                      "Nova Pasta",

                    nodeType:
                      currentFolder
                        ? "DISTRICT"
                        : "CITY"
                  });

                  await loadProjectTree();

                } catch(err) {

                  console.error(
                    "CREATE_FOLDER_ERROR",
                    err
                  );
                }
              }}

              className="
                w-7
                h-7

                rounded-lg

                bg-cyan-500/20

                border
                border-cyan-500/30

                flex
                items-center
                justify-center

                text-cyan-300

                hover:bg-cyan-500/30
              "
            >

              <Plus size={14} />

            </button>

            <button

              onClick={() => {

                setDockVisible(
                  !dockVisible
                );
              }}

              className={`
                w-7
                h-7

                rounded-lg

                border

                flex
                items-center
                justify-center

                transition-all

                ${
                  dockVisible

                  ? `
                    bg-cyan-500/20
                    border-cyan-500/30
                    text-cyan-300
                  `

                  : `
                    bg-white/[0.04]
                    border-white/5
                    text-slate-400
                  `
                }
              `}
            >

              <PanelsTopLeft
                size={13}
              />

            </button>

          </div>

          <div
            className="
              flex
              items-center
              gap-2

              mb-3
            "
          >

            <button

              onClick={goBack}

              className="
                w-8
                h-8

                rounded-lg

                bg-white/[0.04]

                border
                border-white/5

                flex
                items-center
                justify-center

                text-slate-300

                hover:bg-cyan-500/10
                hover:text-cyan-300

                transition-all
              "
            >

              <ArrowLeft size={14} />

            </button>

            <button

              onClick={goForward}

              className="
                w-8
                h-8

                rounded-lg

                bg-white/[0.04]

                border
                border-white/5

                flex
                items-center
                justify-center

                text-slate-300

                hover:bg-cyan-500/10
                hover:text-cyan-300

                transition-all
              "
            >

              <ArrowRight size={14} />

            </button>

            <button

              onClick={goRoot}

              className="
                w-8
                h-8

                rounded-lg

                bg-white/[0.04]

                border
                border-white/5

                flex
                items-center
                justify-center

                text-slate-300

                hover:bg-cyan-500/10
                hover:text-cyan-300

                transition-all
              "
            >

              <Home size={14} />

            </button>

              <button
                title="Mostrar itens"
                onClick={showAllItems}
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-emerald-500/10
                  border
                  border-emerald-500/20
                  flex
                  items-center
                  justify-center
                  text-emerald-300
                "
              >
                <Eye size={14} />
              </button>

              <button
                title="Ocultar itens"
                onClick={hideAllItems}
                className="
                  w-8
                  h-8
                  rounded-lg
                  bg-red-500/10
                  border
                  border-red-500/20
                  flex
                  items-center
                  justify-center
                  text-red-300
                "
              >
                <EyeOff size={14} />
              </button>

          </div>

          <div
            className="
              flex
              items-center
              flex-wrap

              gap-1

              mb-3

              text-[11px]
              text-slate-400
            "
          >

            <button

              onClick={goRoot}

              className="
                hover:text-cyan-300

                transition-all
              "
            >

              🏠 Raiz

            </button>

            {currentPath.map(
              (
                folder: any,
                index: number
              ) => (

                <div
                  key={folder.id}

                  className="
                    flex
                    items-center
                    gap-1
                  "
                >

                  <span>/</span>

                  <button

                    onClick={() => {

                      setCurrentFolder(
                        folder
                      );

                      setCurrentPath(
                        currentPath.slice(
                          0,
                          index + 1
                        )
                      );
                    }}

                    className="
                      hover:text-cyan-300

                      transition-all
                    "
                  >

                    {folder.name}

                  </button>

                </div>
              )
            )}

          </div>

          <div className="relative">

            <Search
              size={13}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />

            <input

              placeholder="Pesquisar..."

              className="
                w-full
                h-9

                rounded-xl

                bg-white/[0.03]

                border
                border-white/5

                pl-8
                pr-3

                text-[12px]
                text-white

                outline-none

                focus:border-cyan-500/40
              "
            />

          </div>

        </div>

        

<div className="

            flex-1 overflow-auto

            rounded-b-2xl

            px-2
            py-3
            pr-3

            space-y-1

            scrollbar-thin
            scrollbar-thumb-white/10
            scrollbar-track-transparent
          "
        >



          {(
            currentFolder
              ? currentFolder.children || []
              : tree
          ).map(
            (item: any) => (

              
<TreeItem

                  key={item.id}

                  item={item}

                  tree={tree}

                  removeFolder={
                    removeFolder
                  }

                  renameFolder={
                    renameFolder
                  }

                  addSubfolder={
                    addSubfolder
                  }


                  openFolder={
                    openFolder
                  }

                  selectedNodeId={
                    selectedNodeId
                  }

                  setSelectedNodeId={
                    setSelectedNodeId
                  }

                  setFocusedNodeId={
                    setFocusedNodeId
                  }

                  markers={
                    markers
                  }

                  setMarkers={
                    setMarkers
                  }

                  toggleNodeVisibility={
                    toggleNodeVisibility
                  }

                  loadProjectTree={
                    loadProjectTree
                  }

                  currentFolder={
                    currentFolder
                  }

                  setCurrentFolder={
                    setCurrentFolder
                  }

                />

            )
          )}

        </div>


      </div>

    </DraggablePanel>
  );
}
