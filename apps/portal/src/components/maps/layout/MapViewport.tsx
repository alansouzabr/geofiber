"use client";

export default function MapViewport({
  children
}: any) {

  return (

    <main
      className="
        flex-1
        relative
        overflow-hidden
        h-screen
        bg-black
      "
    >

      {children}

    </main>
  );
}
