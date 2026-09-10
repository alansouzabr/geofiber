"use client";

interface Props {

  fiberDraft: any[];

  setFiberDraft: any;

  setFibers: any;

  fiberType: string;
}

export default function FiberFinalizeButton({

  fiberDraft,

  setFiberDraft,

  setFibers,

  fiberType

}: Props) {

  function finalizeFiber() {

    console.log("FIBER_DRAFT=", fiberDraft);


    if (
      fiberDraft.length < 2
    ) {

      return;
    }

    setFibers(
      (prev: any) => [

        ...prev,

        {

          id:
            Date.now(),

          type:
            fiberType,

          points:
            fiberDraft
        }
      ]
    );

    setFiberDraft([]);
  }

  return (

    <button

      onClick={
        finalizeFiber
      }

      className="
        absolute

        bottom-6
        left-1/2

        -translate-x-1/2

        z-[999]

        px-5
        py-2.5

        rounded-xl

        bg-cyan-500

        text-white
        text-sm
        font-medium

        shadow-2xl
      "
    >

      Finalizar Fibra

    </button>
  );
}
