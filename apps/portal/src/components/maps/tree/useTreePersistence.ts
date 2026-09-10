"use client";

import {
  useEffect
} from "react";

export function useTreePersistence(
  tree: any,
  setTree: any
) {

  useEffect(() => {

    const savedTree =
      localStorage.getItem(
        "geofiber-ftth-tree"
      );

    if (savedTree) {

      setTree(
        JSON.parse(savedTree)
      );
    }

  }, [setTree]);

  useEffect(() => {

    localStorage.setItem(

      "geofiber-ftth-tree",

      JSON.stringify(tree)
    );

  }, [tree]);
}
