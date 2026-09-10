"use client";

import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  pole: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PoleAccessoryModal({
  open,
  pole,
  onClose,
  onSave,
}: Props) {

  const [name, setName] = useState("");
  const [observation, setObservation] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setObservation("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black/60 flex items-center justify-center">

      <div className="w-[520px] rounded-xl bg-slate-900 border border-slate-700 p-6">

        <h2 className="text-xl font-bold text-white">
          Nova CTO
        </h2>

        <div className="mt-3 text-sm text-gray-300">
          Poste:
          <span className="ml-2 font-bold text-cyan-400">
            {pole?.name}
          </span>
        </div>

        <div className="mt-6">

          <label className="text-sm text-white">
            Nome
          </label>

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="mt-1 w-full rounded bg-slate-800 p-2 text-white"
          />

        </div>

        <div className="mt-4">

          <label className="text-sm text-white">
            Observação
          </label>

          <textarea
            rows={4}
            value={observation}
            onChange={(e)=>setObservation(e.target.value)}
            className="mt-1 w-full rounded bg-slate-800 p-2 text-white"
          />

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded bg-gray-700 px-4 py-2 text-white"
          >
            Cancelar
          </button>

          <button
            onClick={() => {

              onSave({

                poleId: pole?.id,

                name,

                observation,

                type: "CTO"

              });

            }}
            className="rounded bg-cyan-600 px-4 py-2 text-white"
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}
