"use client";

export default function LeftSidebar({
  children
}: any) {

  return (

    <div
      className="
        absolute

        left-4
        top-24

        z-[5000]

        pointer-events-none
      "
    >

      <div
        className="
          pointer-events-auto
        "
      >

        {children}

      </div>

    </div>
  );
}
