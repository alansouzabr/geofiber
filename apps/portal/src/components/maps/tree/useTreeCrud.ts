import type {
  TreeNode
} from "./treeTypes";

"use client";

import {
  useEffect,
  useState
} from "react";

import {
  TreeNode as TreeNodeComponent
} from "./TreeNode";



import {
  arrayMove
} from "@dnd-kit/sortable";


const STORAGE_KEY =
  "geofiber-ftth-tree-v4";

export function useTreeCrud() {

  const [
    tree,
    setTree
  ] = useState<TreeNode[]>(
    []
  );

  


  


  


  function addFolder(
    parentId?: string
  ) {

    const newFolder: TreeNode = {

      id: String(Date.now()),

      name: "Nova Pasta",

      nodeType: "CATEGORY",

      open: true,

      children: []
    };

    if (!parentId) {

      setTree((prev: TreeNode[]) =>

        prev.map((node: TreeNode) => {

          if (node.id === "1") {

          return {

              ...node,

              open: true,

              children: [

                ...(node.children || []),

                newFolder
              ]
            };
          }

          return node;
        })
      );

      return;
    }

    function recursiveAdd(
      items: any[]
    ): any[] {

      return items.map((item) => {

        if (
          item.id === parentId
        ) {

          return {

            ...item,

            open: true,

            children: [

              ...(item.children || []),

              newFolder
            ]
          };
        }

        return {

          ...item,

          children:
            item.children
              ? recursiveAdd(
                  item.children
                )
              : []
        };
      });
    }

    setTree((prev) =>
      recursiveAdd(prev)
    );
  }

  function removeFolder(
    id: number
  ) {

    function recursiveRemove(
      items: any[]
    ): any[] {

      return items

        .filter(
          (item) =>
            item.id !== id
        )

        .map((item) => ({

          ...item,

          ...(item.children
            ? {
                children:
                  recursiveRemove(
                    item.children
                  )
              }
            : {})
        }));
    }

    setTree((prev) =>
      recursiveRemove(prev)
    );
  }

  function renameFolder(
    id: number,
    newName: string
  ) {

    function recursiveRename(
      items: any[]
    ): any[] {

      return items.map((item) => {

        if (
          item.id === id
        ) {

          return {

            ...item,

            name: newName
          };
        }

        return {

          ...item,

          children:
            item.children
              ? recursiveRename(
                  item.children
                )
              : []
        };
      });
    }

    setTree((prev) =>
      recursiveRename(prev)
    );
  }

  function addSubfolder(
    parentId: number
  ) {

    function recursiveAdd(
      items: any[]
    ): any[] {

      return items.map((item) => {

        if (
          item.id === parentId
        ) {

          return {

            ...item,

            open: true,

            children: [

              ...(item.children || []),

              {

                id: String(Date.now()),

                name:
                  "Nova Subpasta",

                open: true,

                children: []
              }
            ]
          };
        }

        return {

          ...item,

          children:
            item.children
              ? recursiveAdd(
                  item.children
                )
              : []
        };
      });
    }

    setTree((prev) =>
      recursiveAdd(prev)
    );
  }

  function toggleChildren(
    children:any[],
    hidden:boolean
  ): any[] {

    return children.map(
      (child:any) => ({

        ...child,

        hidden,

        children:
          child.children
            ? toggleChildren(
                child.children,
                hidden
              )
            : []
      })
    );
  }

  function toggleNodeVisibility(
    id: number
  ) {

    function recursiveToggle(
      items: any[]
    ): any[] {

      return items.map((item) => {

        if (item.id === id) {


          const newHidden =
            !item.hidden;

          return {

            ...item,

            hidden:
              newHidden,

            children:
              item.children
                ? toggleChildren(
                    item.children,
                    newHidden
                  )
                : []
          };
        }

        return {

          ...item,

          children:
            item.children
              ? recursiveToggle(
                  item.children
                )
              : []
        };
      });
    }

    setTree((prev) =>
      recursiveToggle(prev)
    );
  }


  return {

    tree,

    setTree,

    addFolder,

    removeFolder,

    renameFolder,

    addSubfolder,

    toggleNodeVisibility

  };

}
