"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onCancel
}: Props) {

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          <pre
            className="
              mt-3
              whitespace-pre-wrap
              text-slate-300
              font-sans
            "
          >
            {message}
          </pre>
        </div>

        <div className="flex justify-end gap-3 p-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-5 py-2 text-white"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2 font-bold text-slate-950"
          >
            {loading ? "Processando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
