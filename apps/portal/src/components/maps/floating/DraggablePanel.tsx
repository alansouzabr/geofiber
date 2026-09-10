"use client";

import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  Minus
} from "lucide-react";

interface Props {

  title?: string;

  initialX?: number;

  initialY?: number;

  initialWidth?: number;

  initialHeight?: number;

  dockMode?: boolean;

  children: React.ReactNode;
}

export default function DraggablePanel({

  title,

  initialX = 20,

  initialY = 100,

  initialWidth = 340,

  initialHeight = 520,

  dockMode = false,

  children

}: Props) {

  const panelRef =
    useRef<HTMLDivElement>(null);

  const [

    position,

    setPosition

  ] = useState({

    x: initialX,

    y: initialY
  });

  useEffect(() => {

    if (title === "Dock") {

      (
        window as any
      ).geoFiberDockPosition = {

        x: position.x,

        y: position.y
      };
    }

  }, [

    position,

    title
  ]);

  const [

    size,

    setSize

  ] = useState({

    width: initialWidth,

    height: initialHeight
  });

  const [

    dragging,

    setDragging

  ] = useState(false);

  const [

    resizing,

    setResizing

  ] = useState(false);

  

  

  const dragOffset =
    useRef({

      x: 0,

      y: 0
    });

  const resizeRef =
    useRef({

      x: 0,

      y: 0,

      width: 0,

      height: 0
    });

  const touchDragTimeout =
    useRef<any>(null);

  function startDrag(
    e: React.MouseEvent
  ) {

    setDragging(true);

    dragOffset.current = {

      x:
        e.clientX -
        position.x,

      y:
        e.clientY -
        position.y
    };
  }

  function startTouchDrag(
    e: React.TouchEvent
  ) {

    const touch =
      e.touches[0];

    touchDragTimeout.current =
      setTimeout(() => {

        setDragging(true);

        dragOffset.current = {

          x:
            touch.clientX -
            position.x,

          y:
            touch.clientY -
            position.y
        };

      }, 180);
  }

  function startResize(
    e: React.MouseEvent
  ) {

    e.stopPropagation();

    setResizing(true);

    resizeRef.current = {

      x: e.clientX,

      y: e.clientY,

      width: size.width,

      height: size.height
    };
  }

  useEffect(() => {

    function handleMove(
      e: MouseEvent
    ) {

      if (dragging) {

        setPosition({

          x:
            e.clientX -
            dragOffset.current.x,

          y:
            e.clientY -
            dragOffset.current.y
        });
      }

      if (resizing) {

        const dx =
          e.clientX -
          resizeRef.current.x;

        const dy =
          e.clientY -
          resizeRef.current.y;

        setSize({

          width:
            Math.max(
              260,
              resizeRef.current.width + dx
            ),

          height:
            Math.max(
              240,
              resizeRef.current.height + dy
            )
        });
      }
    }

    function stopAll() {

      clearTimeout(
        touchDragTimeout.current
      );

      setDragging(false);

      setResizing(false);
    }

    function handleTouchMove(
      e: TouchEvent
    ) {

      e.preventDefault();

      if (!dragging)
        return;

      const touch =
        e.touches[0];

      setPosition({

        x:
          touch.clientX -
          dragOffset.current.x,

        y:
          touch.clientY -
          dragOffset.current.y
      });
    }

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      stopAll
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      { passive: false }
    );

    window.addEventListener(
      "touchend",
      stopAll
    );

    return () => {

      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        stopAll
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );

      window.removeEventListener(
        "touchend",
        stopAll
      );
    };

  }, [

    dragging,

    resizing
  ]);

  return (

    <div

      ref={panelRef}

      style={{

        left: position.x,

        top: position.y,

        width: size.width,

        height: size.height
      }}

      className="
        absolute

        touch-none
        select-none

        cursor-move
        z-[999999]
        pointer-events-auto

        touch-none
        select-none
      "
    >

      {!dockMode && (

      <div

        onMouseDown={
          startDrag
        }

        onTouchStart={
          startTouchDrag
        }

        className="
          h-6

          px-2

          flex
          items-center
          justify-between

          rounded-t-[20px]

          bg-[#111827]

          border
          border-white/10

          text-[10px]
          font-semibold
          text-white

          cursor-move
          select-none
        "
      >

        <span>
          {title || "Painel"}
        </span>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

        </div>

      </div>

      )}

      <div

        onMouseDown={
          dockMode
            ? startDrag
            : undefined
        }

        onTouchStart={
          dockMode
            ? startTouchDrag
            : undefined
        }

        className={`
          relative

          ${
            dockMode

            ? `
              bg-transparent
            `

            : `
              border-x
              border-b

              border-white/10

              rounded-b-2xl

              bg-[#111827]
            `
          }
        `}

        style={{
          height:
            dockMode
              ? size.height
              : size.height - 32
        }}
      >

        {children}

        {!dockMode && (

        <div

          onMouseDown={
            startResize
          }

          className="
            absolute

            right-0
            bottom-0

            w-4
            h-4

            rounded-full

            cursor-se-resize

            opacity-0

            hover:opacity-10

            transition-all
          "
        />

        )}

      </div>

    </div>
  );
}
