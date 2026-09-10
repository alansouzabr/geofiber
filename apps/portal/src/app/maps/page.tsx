/*
 * ETAPA32D_LEGACY_MAPS_REDIRECT
 */

import {
  redirect
} from "next/navigation";


export default function LegacyMapsPage() {

  redirect(
    "/execucao/mapas"
  );
}
