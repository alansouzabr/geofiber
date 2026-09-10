"use client";

import CompanyHeader from "./components/CompanyHeader";
import CompanyInfo from "./components/CompanyInfo";
import CompanyLogo from "./components/CompanyLogo";
import CompanyUsers from "./components/CompanyUsers";
import CompanyPermissions from "./components/CompanyPermissions";
import CompanySecurity from "./components/CompanySecurity";

import { useCompanyProfile } from "./hooks/useCompanyProfile";

export default function CompanyPage() {

  const {

    company,

    loading

  } = useCompanyProfile();

  if (loading) {

    return (

      <div
        className="
          rounded-3xl
          border
          border-slate-800
          bg-[#081223]
          p-10
          text-slate-400
        "
      >
        Carregando empresa...
      </div>

    );

  }

  return (

    <main
      className="
        space-y-8
      "
    >

      <CompanyHeader
        company={company}
      />

      <CompanyInfo
        company={company}
      />

      <CompanyLogo
        company={company}
      />

      <CompanyUsers />

      <CompanyPermissions />

      <CompanySecurity />

    </main>

  );

}
