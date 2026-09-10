export function createTreeAsset(
  tree: any[],
  categoryId: number,
  categoryName: string,
  asset: any
) {

  console.log(
    "[TREE] createTreeAsset",
    categoryName,
    asset
  );

  const updated =
    structuredClone(tree);

  function findCategory(
    nodes: any[]
  ): any {

    for (const node of nodes) {

      console.log(
        "[TREE] visiting",
        node.name,
        node.nodeType
      );

      if (
        node.id ===
        categoryId
      ) {

        console.log(
          "[TREE] category found",
          node.name
        );

        return node;
      }

      if (node.children) {

        const found =
          findCategory(
            node.children
          );

        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  const category =
    findCategory(updated);

  
if (!category) {

  console.log(
    "[TREE] category NOT found -> ROOT"
  );

  updated.push({

    ...asset,

    nodeType: "ASSET",

    hidden: false
  });

  return updated;
}

category.children.push({

    ...asset,

    nodeType: "ASSET",

    hidden: false
  });

  console.log(
    "[TREE] asset added",
    category.children.length
  );

  return updated;
}
