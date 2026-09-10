import type {
  TreeNodeType
} from "./treeNodeTypes";

export interface TreeNode {

  id: string;

  name: string;

  nodeType: TreeNodeType;

  type?: string;

  hidden?: boolean;

  open?: boolean;

  children?: TreeNode[];

}

export interface AssetCategory {

  label: string;

  rootNodeType: string;

  folderNodeType: TreeNodeType;

}


export interface FolderCategory {

  label: string;

  folderNodeType: TreeNodeType;

}
