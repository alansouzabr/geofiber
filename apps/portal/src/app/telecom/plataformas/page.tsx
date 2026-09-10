"use client";

import { createElement } from "react";

import GeoFiberDashboard
  from "@/components/geofiber/projects/GeoFiberDashboard";


/*
 * ETAPA35A14A_TELECOM_PLATFORMS
 *
 * Telecomunicação utiliza a mesma central visual
 * de plataformas do Dashboard.
 *
 * O AppShell vem de /telecom/layout.tsx.
 */
export default function TelecomPlataformasPage() {

  return createElement(
    GeoFiberDashboard
  );

}
