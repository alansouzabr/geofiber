import {
  ASSET_CATEGORIES
} from "./assetCategories";

export function getAssetCategory(type: string) {

  return (
    ASSET_CATEGORIES[
      type as keyof typeof ASSET_CATEGORIES
    ] ?? ASSET_CATEGORIES.POLE
  );

}

function clearAssets(nodes: any[]) {

  for (const node of nodes) {

    if (!node.children) {
      continue;
    }

    node.children = node.children.filter(
      (child: any) =>
        child.nodeType !== "ASSET" &&
        child.nodeType !== "POSTES" &&
        child.nodeType !== "CTOS" &&
        child.nodeType !== "CEOS" &&
        child.nodeType !== "CLIENTES"
    );

    clearAssets(node.children);
  }
}

export function findFolder(
  nodes: any[],
  id: string
): any {

  for (const node of nodes) {

    if (node.id === id) {
      return node;
    }

    if (node.children) {

      const found = findFolder(
        node.children,
        id
      );

      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function syncTreeAssets(
  tree: any[],
  updater?: (tree: any[]) => void
) {
  const cloned = structuredClone(tree);

  clearAssets(cloned);

  if (updater) {
    updater(cloned);
  }

  return cloned;
}
