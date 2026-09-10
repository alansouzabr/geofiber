"use client";

import UsersManager from "@/components/client/users/UsersManager";

export default function CompanyUsers() {

  return (

    <section
      className="
        rounded-3xl
        border
        border-slate-800
        bg-[#081223]
        p-8
      "
    >

      <div className="mb-8">

        <h2
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          Usuários da Empresa
        </h2>

        <p
          className="
            mt-2
            text-slate-400
          "
        >
          Cadastre usuários que terão acesso ao Portal GeoFiber Enterprise
          e aos documentos GED conforme suas permissões.
        </p>

      </div>

      <UsersManager />

    </section>

  );

}
