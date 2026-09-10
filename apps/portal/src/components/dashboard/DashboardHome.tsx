"use client";

import DashboardHero from "./modules/dashboard/DashboardHero";
import DashboardPlatforms from "./modules/dashboard/DashboardPlatforms";
import FilesCard from "./FilesCard";

export default function DashboardHome({

  company

}: any){

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
      "
    >

      <DashboardHero
        company={company}
      />

      <div className="mt-10">

        <DashboardPlatforms />

      </div>

      <div className="mt-10">

        <FilesCard
          company={company}
        />

      </div>

    </section>

  );

}
