"use client";

import { createElement } from "react";

import GeoFiberDashboard
  from "@/components/geofiber/projects/GeoFiberDashboard";


/*
 * ETAPA35A14A_EXECUTION_PLATFORMS
 *
 * Execução utiliza a mesma central visual
 * de plataformas do Dashboard.
 *
 * O AppShell vem de /execucao/layout.tsx.
 */
export default function ExecucaoPlataformasPage() {

  return createElement(
    GeoFiberDashboard
  );

}
