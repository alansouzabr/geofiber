import {
  ensureChildren
} from "./treeHelpers";

import type {
  TreeNode,
  FolderCategory
} from "./treeTypes";

import type {
  AssetType
} from "./assetTypes";

interface TreeAsset {

  id: string;

  name: string;

  type: AssetType;

  hidden?: boolean;

}

import {
  syncTreeAssets,
  findFolder,
  getAssetCategory
} from "./syncTreeAssets";

export {
  syncTreeAssets,
  findFolder,
  getAssetCategory
};


export function buildAssetNode(
  asset: TreeAsset
): TreeNode {

  return {

    id: asset.id,

    name: asset.name,

    nodeType: "ASSET",

    type: asset.type,

    hidden:
      asset.hidden ?? false

  };

}


export function updateCategoryLabel(
  category: TreeNode
): TreeNode {

  category.name =
    `${category.name.split(" (")[0]} (${category.children.length})`;

  return category;

}


export function ensureCategoryNode(
  parent: TreeNode,
  category: FolderCategory
): TreeNode {

  const children =
    ensureChildren(parent);

  let node =
    children.find(
      (c: TreeNode)=>
        c.nodeType === category.folderNodeType
    );

  if(node){
    return node;
  }

  
  node =
    createCategoryNode(
      category,
      parent.id
    );



  children.push(node);

  return node;

}


export function createCategoryNode(

  category: FolderCategory,

  parentId: string

): TreeNode {

  return {

    id:
      `${category.label.toLowerCase()}-${parentId}`,

    name:
      category.label,

    nodeType:
      category.folderNodeType,

    hidden: false,

    open: true,

    children: []

  };

}

export function syncPoleCategory(
  folder: TreeNode,
  asset: TreeNode,
  category: FolderCategory
) {

  const categoryNode =
    ensureCategoryNode(
      folder,
      category
    );

  categoryNode.children.push(
    asset
  );

  updateCategoryLabel(
    categoryNode
  );

  return categoryNode;
}
