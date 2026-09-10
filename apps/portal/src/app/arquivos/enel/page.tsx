/*
 * ETAPA32C2_ENEL
 */

import ExternalPortalShortcut
from "@/components/common/ExternalPortalShortcut";


export default function EnelPage() {

  return (
    <div>

      <div
        className="
          mb-6
        "
      >

        <h1
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          Enel
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          Documentação e acesso aos serviços da concessionária.
        </p>

      </div>


      <ExternalPortalShortcut
        title="Enel"
        description="
          Acesso ao portal de serviços e relacionamento
          da Enel. O sistema será aberto em uma nova aba.
        "
        url="https://join-as.enel.com/br"
        buttonLabel="Acessar Enel"
      />

    </div>
  );
}
