import type {
  TreeNode
} from "./treeTypes";

export function ensureChildren(
  node: TreeNode
): TreeNode[] {

  node.children ??= [];

  return node.children;

}

export function isFolder(
  node: TreeNode
): boolean {

  return !!node.children;

}

export function isAsset(
  node: TreeNode
): boolean {

  return node.nodeType === "ASSET";

}
