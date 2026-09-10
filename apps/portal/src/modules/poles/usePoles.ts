import { useState } from "react";

export function usePoles() {
  const [poles, setPoles] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function addPole(lat: number, lng: number) {
    const newPole = {
      id: Date.now().toString(),
      lat,
      lng,
      name: "Novo Poste"
    };

    setPoles((prev) => [...prev, newPole]);
  }

  function removePole(id: string) {
    setPoles((prev) => prev.filter(p => p.id !== id));
  }

  function selectPole(id: string) {
    setSelectedId(id);
  }

  return {
    poles,
    setPoles,
    addPole,
    removePole,
    selectedId,
    selectPole,
  };
}
