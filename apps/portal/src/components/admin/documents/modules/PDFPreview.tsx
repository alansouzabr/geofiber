interface Props {

  url: string;

  open: boolean;

  onClose: any;
}

export default function PDFPreview({

  url,

  open,

  onClose

}: Props) {

  if (!open) {
    return null;
  }

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        bg-black/80
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-6xl
          h-[90vh]
          bg-slate-950
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
          flex
          flex-col
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            p-4
            border-b
            border-slate-800
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-white
            "
          >
            Visualização PDF
          </h2>

          <button
            onClick={onClose}
            className="
              bg-red-500
              hover:bg-red-400
              transition
              px-4
              py-2
              rounded-lg
              font-semibold
              text-white
            "
          >
            Fechar
          </button>

        </div>

        <iframe
          src={url}
          className="
            flex-1
            w-full
            bg-white
          "
        />

      </div>

    </div>
  );
}
