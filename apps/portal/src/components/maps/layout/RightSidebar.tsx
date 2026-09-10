"use client";

export default function RightSidebar({
  children
}: any) {

  return (

    <aside
      className="
        absolute
        right-3
        top-20
        bottom-3

        z-[1000]

        w-[240px]

        hidden
        lg:flex

        flex-col
        gap-3

        overflow-y-auto
      "
    >

      {children}

    </aside>
  );
}
