"use client";

import Hero from "./modules/Hero/Hero";
import MainCards from "./modules/Cards/MainCards";
import PlatformInfo from "./modules/PlatformInfo/PlatformInfo";

export default function GeoFiberDashboard() {

  return (

    <section
      className="
        w-full
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-8
        text-white
      "
    >

      <Hero />

      <MainCards />

      <PlatformInfo />

    </section>

  );

}
