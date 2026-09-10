"use client";

import { editorStore } from '@/modules/editor/editor.store';
import { poleTypes } from '@/modules/poles/poleTypes';

export default function EditorToolbar() {
  return (
    <div style={{
      position: "absolute", zIndex: 9999,
      top: 80,
      left: 10,
      background: '#2b2b2b',
      padding: 10,
      borderRadius: 10,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }}>
      {poleTypes.map(p => (
        <button
          key={p.id}
          onClick={() => editorStore.setTool(p.id)}
        >
          📍 {p.label}
        </button>
      ))}

      <hr />

      <button onClick={() => editorStore.setTool(null)}>
        ❌ Cancelar
      </button>
    </div>
  );
}
