"use client";

import DashboardHome
from "@/components/dashboard/DashboardHome";

export default function DashboardSection({

  company

}: any){

  return (

    <DashboardHome
      company={company}
    />

  );

}
