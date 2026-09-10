/*
 * ETAPA35A15B_ALVARA_AVCB
 *
 * Página global no AppShell.
 *
 * ROOT -> RootSidebar / RootHeader
 * MASTER -> MasterSidebar / MasterHeader
 *
 * ADMIN vinculado a empresa é canonicalizado
 * para /dashboard/[company]?tab=empresa-alvara-avcb
 * pelo companyRouteMap.
 */

import AlvaraAvcbGlobalManager
from "@/components/documents/AlvaraAvcbGlobalManager";


export default function AlvaraAvcbPage() {

  return (
    <AlvaraAvcbGlobalManager
      mode="platform"
    />
  );

}
