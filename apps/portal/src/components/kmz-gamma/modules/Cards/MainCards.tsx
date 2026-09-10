"use client";

import KmzCard from "./KmzCard";
import GedCard from "./GedCard";
import MapsCard from "./MapsCard";

export default function MainCards(){

  return(

    <section
      className="
        mt-10
        grid
        gap-8
        lg:grid-cols-3
      "
    >

      <KmzCard />

      <GedCard />

      <MapsCard />

    </section>

  );

}
