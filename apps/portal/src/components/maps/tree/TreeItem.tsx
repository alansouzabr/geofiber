"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Cable,
  Network,
  Users,
    Box,
    CheckSquare,
    Square
} from "lucide-react";


import {
  apiFetch
} from "@/lib/api";







interface Props {

  item: any;

  tree: any[];

  removeFolder: (
    id: number
  ) => void;

  renameFolder: (
    id: number,
    name: string
  ) => void;

  addSubfolder: (
    id: number
  ) => void;

  openFolder: (
    folder: any
  ) => void;

  currentFolder?: any;

  setCurrentFolder?: (
    folder:any
  ) => void;

  selectedNodeId: string | number | null;

  setSelectedNodeId: (
    id: string | number
  ) => void;

  setFocusedNodeId: (
    id: string | number
  ) => void;

  markers: any[];

  setMarkers: any;

    toggleNodeVisibility: (
      id: number
    ) => void;

    loadProjectTree?: () => Promise<void>;
}

function getIcon(name: string) {

  if (name === "Backbone") {

    return (
      <Cable size={12} />
    );
  }

  if (name === "CTOs") {

    return (
      <Network size={12} />
    );
  }

  if (name === "Clientes") {

    return (
      <Users size={12} />
    );
  }

  if (name === "CEOs") {

    return (
      <Box size={12} />
    );
  }

  return null;
}


function collectAssetIds(node:any): string[] {

  let ids:string[] = [];

  if (
    node?.nodeType === "ASSET"
  ) {
    ids.push(
      String(node.id)
    );
  }

  if (
    Array.isArray(
      node?.children
    )
  ) {
    node.children.forEach(
      (child:any) => {
        ids.push(
          ...collectAssetIds(child)
        );
      }
    );
  }

  return ids;
}

export default function TreeItem({

  item,

  tree,

  removeFolder,

  renameFolder,

  addSubfolder,

  openFolder,

  currentFolder,

  setCurrentFolder,

  selectedNodeId,

  setSelectedNodeId,

  setFocusedNodeId,

  markers,

  setMarkers,

    toggleNodeVisibility,

    loadProjectTree

}: Props) {

  
  const isFolder =

    item.nodeType === "CITY" ||

    item.nodeType === "DISTRICT" ||

    item.nodeType === "CATEGORY";

  const isCategory =

    item.nodeType === "POSTES_CATEGORY" ||

    item.nodeType === "ROOT_POSTES_CATEGORY" ||

    item.nodeType === "FIBRAS_CATEGORY" ||

    item.nodeType === "ACESSORIOS_CATEGORY" ||

    item.nodeType === "GRUPOS_CATEGORY" ||

    item.nodeType === "ESTACOES_CATEGORY" ||

    item.nodeType === "RACKS_CATEGORY" ||

    item.nodeType === "OTDR_PRISMA_CATEGORY" ||

    item.nodeType === "ROOT_FIBRAS_CATEGORY" ||

    item.nodeType === "ROOT_ACESSORIOS_CATEGORY" ||

    item.nodeType === "ROOT_GRUPOS_CATEGORY" ||

    item.nodeType === "ROOT_ESTACOES_CATEGORY" ||

    item.nodeType === "ROOT_RACKS_CATEGORY" ||

    item.nodeType === "ROOT_OTDR_CATEGORY";

const isAsset =
      item.nodeType ===
      "ASSET";

    const isProject =
      !isCategory &&
      !isAsset &&
      isFolder;

      const open =
      item.open ?? true;


  
  const [
    contextOpen,
    setContextOpen
  ] = useState(false);

  const [
    editing,
    setEditing
  ] = useState(false);

  const [
    folderName,
    setFolderName
  ] = useState(item.name);

  const [
    deleteOpen,
    setDeleteOpen
  ] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    function handleClick(
      e: MouseEvent
    ) {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {

        setContextOpen(false);
      }
    }

    window.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {

      window.removeEventListener(
        "mousedown",
        handleClick
      );
    };

  }, []);

  function handleDelete() {

    setDeleteOpen(true);

    setContextOpen(false);
  }

  async function confirmDelete() {


    try {

      if (
        item.nodeType === "ASSET" &&
        (
          item.type === "POSTE_CONCRETO" ||
          item.type === "POSTE_METALICO"
        )
      ) {


        await apiFetch(
          `/poles/${item.id}`,
          {
            method: "DELETE"
          }
        );
      }

    } catch (err) {

      console.error(
        "DELETE POLE ERROR",
        err
      );
    }

    

      if (item.nodeType !== "ASSET") {


        await apiFetch(
          `/project-folders/${item.id}`,
          {
            method: "DELETE"
          }
        );

        await loadProjectTree?.();

      }

if (item.nodeType === "ASSET") {

  setMarkers(
    (prev:any[]) =>
      prev.filter(
        (m:any) =>
          String(m.id) !==
          String(item.id)
      )
  );
}

setDeleteOpen(false);

  }

  function handleToggleVisibility(
    e:any
  ) {

    e.stopPropagation();

    toggleNodeVisibility(
      item.id
    );


    if (isProject) {

      const hideAll =
        !item.hidden;

      const assetIds =
        collectAssetIds(item);

      setMarkers(
        (prev:any[]) =>
          prev.map(
            marker =>

              assetIds.includes(
                String(marker.id)
              )
                ? {
                    ...marker,
                    hidden: hideAll
                  }
                : marker
          )
      );

      return;
    }

    if (
      isCategory &&
      String(item.name)
        .toUpperCase()
        .startsWith("POSTES")
    ) {

      const hideAll =
        !item.hidden;

      const assetIds =
        collectAssetIds(item);

      setMarkers(
        (prev:any[]) =>
          prev.map(marker =>

            assetIds.includes(
              String(marker.id)
            )
              ? {
                  ...marker,
                  hidden: hideAll
                }
              : marker

          )
      );

      return;
    }


    setMarkers(
      (prev:any[]) =>
        prev.map(
          marker =>
            marker.id === item.id
              ? {
                  ...marker,
                  hidden:
                    !marker.hidden
                }
              : marker
        )
    );
  }

  


  return (

    <div
      className="
        relative

        text-[12px]
        text-slate-200
      "
    >

      <div



        onClick={() => {


          setSelectedNodeId(
            item.id
          );
        }}

        onDoubleClick={() => {


          if (isCategory) {


            setCurrentFolder?.(
              item
            );

            openFolder(item);

            return;
          }

          if (isAsset) {

            setFocusedNodeId(
              item.id
            );

            return;
          }

          if (isProject) {


            setCurrentFolder?.(
              item
            );

            openFolder(
              item
            );

            return;
          }
        }}

        onContextMenu={(e) => {

          e.preventDefault();

          setContextOpen(true);
        }}

        className={`
          flex
          items-center
          gap-2

          px-2
          py-2

          rounded-xl

          hover:bg-cyan-500/10

          ${
            selectedNodeId === item.id
              ? "bg-cyan-500/20 border border-cyan-400/30"
              : ""
          }

          transition-all

          cursor-pointer
        `}
      >

        {isFolder && (

          open ? (

            <ChevronDown
              size={12}
            />

          ) : (

            <ChevronRight
              size={12}
            />
          )
        )}

        {isCategory || isAsset ? (

          <div
            onClick={(e) => {
              e.stopPropagation();
              
              handleToggleVisibility(e);
            }}

            onDoubleClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}

            className="
              flex
              items-center
              justify-center
              cursor-pointer
            "
          >

            {item.hidden ? (

              <Square size={14} />

            ) : (

              <CheckSquare size={14} />

            )}

          </div>

        ) : isProject ? (

          <div
            className="
              flex
              items-center
              gap-1
            "
          >

            <div
              onClick={(e) => {
                e.stopPropagation();
                
              handleToggleVisibility(e);
              }}
              className="
                flex
                items-center
                justify-center
                cursor-pointer
              "
            >

              {item.hidden ? (
                <Square size={14} />
              ) : (
                <CheckSquare size={14} />
              )}

            </div>

            {open ? (
              <FolderOpen size={14} />
            ) : (
              <Folder size={14} />
            )}

          </div>

          ) : (

            getIcon(item.name)

          )}

        {editing ? (

          <input

            autoFocus

            value={folderName}

            onChange={(e) =>
              setFolderName(
                e.target.value
              )
            }

            onBlur={async () => {

              if (
                item.nodeType === "ASSET"
              ) {

                try {

                  await apiFetch(
                    `/poles/${item.id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type":
                          "application/json"
                      },
                      body: JSON.stringify({
                        name: folderName
                      })
                    }
                  );

                  setMarkers(
                    (prev:any[]) =>
                      prev.map(
                        (m:any) =>
                          String(m.id) ===
                          String(item.id)
                            ? {
                                ...m,
                                name: folderName
                              }
                            : m
                      )
                  );

                } catch (err) {

                  console.error(
                    "POLE_RENAME_ERROR",
                    err
                  );
                }

              } else {

                renameFolder(
                  item.id,
                  folderName
                );
              }

              setEditing(false);
            }}

            className="
              bg-transparent

              border-none
              outline-none

              text-white

              w-full
            "
          />

        ) : (

          <span
            className="
              truncate
            "
          >
            {folderName}

            {(
              !String(folderName).match(/\(\d+\)$/) &&
              item.children?.length
            )
              ? ` (${item.children.length})`
              : ""}

          </span>
        )}

      </div>

      
{contextOpen && (

  <div

    ref={menuRef}

    className="
      absolute

      left-10
      top-10

      z-[999999]

      w-[220px]

      rounded-2xl

      overflow-hidden

      bg-[#111827]/95

      backdrop-blur-xl

      border
      border-white/10

      shadow-2xl
    "
  >

    {isFolder && (

      <button

        onClick={() => {

          addSubfolder(
            item.id
          );

          setContextOpen(false);
        }}

        className="
          w-full

          text-left

          px-4
          py-3

          text-[12px]

          hover:bg-cyan-500/10

          transition-all
        "
      >

        Nova Subpasta

      </button>
    )}

    {isFolder && (

      <button

        onClick={() => {

          openFolder(item);

          setContextOpen(false);
        }}

        className="
          w-full

          text-left

          px-4
          py-3

          text-[12px]

          hover:bg-cyan-500/10

          transition-all
        "
      >

        Abrir Pasta

      </button>
    )}

    

    <button

      onClick={() => {

        setEditing(true);

        setContextOpen(false);
      }}

      className="
        w-full

        text-left

        px-4
        py-3

        text-[12px]

        hover:bg-cyan-500/10

        transition-all
      "
    >

      Editar

    </button>

    <button

      onClick={
        handleDelete
      }

      className="
        w-full

        text-left

        px-4
        py-3

        text-[12px]

        text-red-400

        hover:bg-red-500/10

        transition-all
      "
    >

      Excluir

    </button>

  </div>
)}


      {deleteOpen && (

        <div
          className="
            fixed
            inset-0

            z-[99999999]

            flex
            items-center
            justify-center

            bg-black/50

            backdrop-blur-sm
          "
        >

          <div
            className="
              w-[380px]

              rounded-3xl

              bg-[#0f172a]

              border
              border-white/10

              shadow-2xl

              p-5
            "
          >

            <div
              className="
                text-white
                text-lg
                font-semibold

                mb-2
              "
            >

              ⚠ Confirmar Exclusão

            </div>

            <div
              className="
                text-[13px]
                text-slate-400

                mb-5
              "
            >

              Deseja excluir:

              <span
                className="
                  text-cyan-300
                "
              >

                {" "}
                {item.name}

              </span>

              ?

            </div>

            <div
              className="
                flex
                justify-end
                gap-2
              "
            >

              <button

                onClick={() =>
                  setDeleteOpen(false)
                }

                className="
                  px-4
                  py-2

                  rounded-xl

                  bg-white/5

                  text-slate-300

                  hover:bg-white/10
                "
              >

                Cancelar

              </button>

              <button

                onClick={
                  confirmDelete
                }

                className="
                  px-4
                  py-2

                  rounded-xl

                  bg-red-500/20

                  border
                  border-red-500/30

                  text-red-300

                  hover:bg-red-500/30
                "
              >

                Excluir

              </button>

            </div>

          </div>

        </div>
      )}




      


      

      {/* EXPLORER MODE - SEM RECURSAO */}

    </div>
  );
}
