"use client";

import FloatingPanel from "./FloatingPanel";

export default function PostPanel() {
  return (
    <FloatingPanel title="Postes">
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <button>Adicionar Poste</button>
        <button>Editar Poste</button>
        <button>Excluir Poste</button>
      </div>
    </FloatingPanel>
  );
}