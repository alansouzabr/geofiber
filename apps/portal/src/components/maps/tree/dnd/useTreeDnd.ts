"use client";

export function useTreeDnd() {

  function moveItem(
    activeId: number,
    overId: number
  ) {

    console.log(
      "MOVE",
      activeId,
      "->",
      overId
    );
  }

  return {
    moveItem
  };
}
