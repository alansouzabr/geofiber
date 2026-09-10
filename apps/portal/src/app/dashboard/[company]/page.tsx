"use client";

import GeoFiberDashboard from "@/components/geofiber/projects/GeoFiberDashboard";

import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useSearchParams
} from "next/navigation";

import ClientLayout
from "@/components/client/layout/ClientLayout";

import DashboardSection
from "@/components/dashboard/dashboard/DashboardSection";

import FilesSection
from "@/components/dashboard/FilesSection";

import ProjectsSection
from "@/components/dashboard/ProjectsSection";

import TrtSection
from "@/components/dashboard/TrtSection";

import ClientDocumentsSection
from "@/components/dashboard/client-documents/ClientDocumentsSection";

import AlvaraAvcbGlobalManager
from "@/components/documents/AlvaraAvcbGlobalManager";

import FinanceSection
from "@/components/dashboard/FinanceSection";

import CompanyProfileEditor
from "@/components/company/CompanyProfileEditor";

import SettingsPage from "@/components/settings/SettingsPage";

import ExecutionDashboard from "@/components/execution/ExecutionDashboard";

import ExternalCourseButton
from "@/components/training/buttons/ExternalCourseButton";

import TrainingLibraryManager
from "@/components/training/TrainingLibraryManager";

import SstCompanyLibraryManager
from "@/components/safety/SstCompanyLibraryManager";

import UsersManager
from "@/components/client/users/UsersManager";

import AdminDelegatedPermissions
from "@/components/client/permissions/AdminDelegatedPermissions";

import ExternalPortalShortcut
from "@/components/common/ExternalPortalShortcut";

import MapsPageImpl
from "@/app/maps/page.impl";

import ChecklistPage
from "@/app/execucao/checklist/page";

import {
  FerramentasView
} from "@/components/execution/ferramentas/FerramentasView";

import KmzPage
from "@/app/projetos/kmz/page";

import TechniciansPage
from "@/components/execution/technicians/TechniciansPage";

import TenantCarroPage
from "@/components/execution/vehicles/TenantCarroPage";


/*
 * ETAPA35S21_COMPANY_TRAINING_TABS
 *
 * Treinamentos da empresa permanecem
 * dentro do ClientLayout.
 *
 * As páginas globais continuam intactas.
 */
type CompanyTrainingHomeProps = {
  setTab: (tab: string) => void;
};

function CompanyTrainingHome({
  setTab
}: CompanyTrainingHomeProps) {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Treinamentos
        </h1>

        <p className="mt-2 text-slate-400">
          Biblioteca técnica de TI, Redes e Telecom.
        </p>

      </div>


      <button
        type="button"
        onClick={() =>
          setTab("treinamentos-telecom")
        }
        className="
          block
          w-full
          max-w-2xl
          rounded-xl
          border
          border-slate-700
          p-6
          text-left
          transition
          hover:bg-slate-900
          hover:border-cyan-600
        "
      >

        <h2 className="text-xl font-semibold">
          TI / Redes / Telecom
        </h2>

        <p className="mt-3 text-slate-400">
          NOC, redes, telecomunicações,
          backbone e infraestrutura.
        </p>

      </button>


      <div
        className="
          rounded-xl
          border
          border-slate-700
          bg-slate-900
          p-6
        "
      >

        <h2 className="text-xl font-semibold">
          Plataforma de Cursos Online
        </h2>

        <p className="mt-3 text-slate-400">
          Acesse os cursos disponibilizados
          pela plataforma.
        </p>

        <div className="mt-4">

          <ExternalCourseButton />

        </div>

      </div>

    </div>

  );
}


type CompanyTrainingDetailProps = {
  kind: "normas" | "telecom";
};

function CompanyTrainingDetail({
  kind
}: CompanyTrainingDetailProps) {

  const isNormas =
    kind === "normas";

  const title =
    isNormas
      ? "Normas Regulamentadoras"
      : "TI / Redes / Telecom";

  const description =
    isNormas
      ? "Normas de segurança e requisitos regulatórios."
      : "Biblioteca técnica para equipes de NOC.";

  const sectionTitle =
    isNormas
      ? "Material de Normas Regulamentadoras"
      : "Biblioteca Técnica";

  const category =
    isNormas
      ? "Treinamento NR"
      : "Treinamento TI / Redes / Telecom";

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="text-slate-400 mt-2">
          {description}
        </p>

      </div>

      <div
        className="
          rounded-xl
          border
          border-slate-700
          p-6
          space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Curso
        </h2>

        <p className="text-slate-400">
          Acesse o treinamento completo pela plataforma da empresa.
        </p>

        <ExternalCourseButton />

      </div>

      <div
        className="
          rounded-xl
          border
          border-slate-700
          p-6
        "
      >

        <h2 className="text-xl font-semibold mb-4">
          {sectionTitle}
        </h2>

        <TrainingLibraryManager
          defaultCategory={category}
          allowedCategories={
            isNormas
              ? [
                  "Treinamento NR",
                  "SST / PGR / PCMSO"
                ]
              : [
                  "Treinamento TI / Redes / Telecom"
                ]
          }
          embedded
          showFilters={false}
        />

      </div>

    </div>

  );

}


type CompanySafetyHomeProps = {
  setTab: (tab: string) => void;
};


function CompanySafetyHome({
  setTab
}: CompanySafetyHomeProps) {

  const options = [

    {
      title:
        "Normas Regulamentadoras",

      tab:
        "seguranca-normas",

      description:
        "NRs, treinamentos e documentação de segurança."
    },

    {
      title:
        "SST / PGR / PCMSO",

      tab:
        "seguranca-sst",

      description:
        "Saúde ocupacional, PGR, PCMSO e gerenciamento de riscos."
    }

  ];


  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Segurança do Trabalho
        </h1>

        <p className="mt-2 text-slate-400">
          Treinamentos e documentação
          de segurança e saúde ocupacional.
        </p>

      </div>


      <div className="grid gap-5 lg:grid-cols-2">

        {options.map(
          option => (

            <button
              key={option.tab}
              type="button"
              onClick={() =>
                setTab(option.tab)
              }
              className="
                rounded-xl
                border
                border-slate-700
                p-6
                text-left
                transition
                hover:bg-slate-900
                hover:border-cyan-600
              "
            >

              <h2 className="text-xl font-semibold">
                {option.title}
              </h2>

              <p className="mt-3 text-slate-400">
                {option.description}
              </p>

            </button>

          )
        )}

      </div>

    </div>

  );
}


function CompanySstDetail({
  companyId
}: {
  companyId: string;
}) {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          SST / PGR / PCMSO
        </h1>

        <p className="mt-2 text-slate-400">
          Segurança e Saúde no Trabalho,
          Programa de Gerenciamento de Riscos
          e Programa de Controle Médico de
          Saúde Ocupacional.
        </p>

      </div>


      <div
        className="
          rounded-xl
          border
          border-slate-700
          p-6
        "
      >

        <h2 className="mb-4 text-xl font-semibold">
          Documentação e Treinamentos
        </h2>


        <SstCompanyLibraryManager
          companyId={companyId}
          embedded
        />

      </div>

    </div>

  );
}


type CompanyTechnicalHubProps = {
  title: string;
  description: string;
  setTab: (tab: string) => void;
};


function CompanyTechnicalHub({
  title,
  description,
  setTab
}: CompanyTechnicalHubProps) {

  const items = [

    {
      label:
        "KMZ",

      tab:
        "arquivos-kmz",

      description:
        "Arquivos geográficos KMZ/KML."
    },

    {
      label:
        "DWG",

      tab:
        "arquivos-dwg",

      description:
        "Projetos e desenhos técnicos DWG."
    },

    {
      label:
        "GED",

      tab:
        "arquivos-ged",

      description:
        "Gestão eletrônica de documentos."
    }

  ];


  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">
          {description}
        </p>

      </div>


      <div
        className="
          grid
          gap-5
          md:grid-cols-3
        "
      >

        {items.map(
          item => (

            <button
              key={item.tab}
              type="button"
              onClick={() =>
                setTab(item.tab)
              }
              className="
                rounded-xl
                border
                border-slate-700
                p-6
                text-left
                transition
                hover:bg-slate-900
                hover:border-cyan-600
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                  text-cyan-400
                "
              >
                {item.label}
              </h2>

              <p className="mt-3 text-slate-400">
                {item.description}
              </p>

            </button>

          )
        )}

      </div>

    </div>

  );
}


type CompanyFilesPanelProps = {
  companyId: string;
  title: string;
  description: string;
  defaultCategory?: string;
  external?:
    | "feninfra"
    | "anatel-enel";
};


function CompanyFilesPanel({
  companyId,
  title,
  description,
  defaultCategory,
  external
}: CompanyFilesPanelProps) {

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="mt-2 text-slate-400">
          {description}
        </p>

      </div>


      {
        external === "feninfra"
          ? (
              <ExternalPortalShortcut
                title="Feninfra"
                description="Acesso ao sistema Atesto Feninfra. O portal será aberto em uma nova aba."
                url="https://atesto.feninfra.org.br/"
                buttonLabel="Acessar Feninfra"
              />
            )
          : null
      }


      {
        external === "anatel-enel"
          ? (
              <div className="grid gap-4 lg:grid-cols-2">

                <ExternalPortalShortcut
                  title="Anatel"
                  description="Acesso ao sistema de Coleta de Dados da Anatel."
                  url="https://apps.anatel.gov.br/Acesso/Login.aspx?Sistema=ColetadeDadosAnatel"
                  buttonLabel="Acessar Anatel"
                />

                <ExternalPortalShortcut
                  title="Enel"
                  description="Acesso ao portal de serviços e relacionamento da Enel."
                  url="https://join-as.enel.com/br"
                  buttonLabel="Acessar Enel"
                />

              </div>
            )
          : null
      }


      <ClientDocumentsSection
        companyId={companyId}
        defaultCategory={
          defaultCategory
        }
      />

    </div>
  );

}


export default function CompanyPage() {

  const params =
    useParams();

  const companyId =
      params.company as string;

    /*
     * ETAPA35A11C2D_QUERY_TAB
     *
     * Permite que qualquer navegação ADMIN global
     * retorne ao dashboard da empresa preservando
     * o módulo selecionado.
     */
    const searchParams =
      useSearchParams();

    const requestedTab =
      searchParams.get("tab");

    const [tab, setTab] =
      useState(
        requestedTab ||
        "dashboard"
      );

    useEffect(() => {

      if (!requestedTab) {
        return;
      }

      setTab(
        current =>
          current === requestedTab
            ? current
            : requestedTab
      );

    }, [requestedTab]);

const [company, setCompany] =
    useState<any>(null);

  useEffect(() => {

    loadCompany();

  }, []);

  async function loadCompany() {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(

          `${process.env.NEXT_PUBLIC_API_URL || "https://api.geofibers.com.br"}/company-profile/${encodeURIComponent(companyId)}`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await res.json();

      setCompany(data?.company ?? data);

    } catch (err) {

      console.error(err);
    }
  }

  function renderContent() {

      if (
        tab === "dashboard-kmz-dwg-ged"
      ) {

        return (
          <CompanyTechnicalHub
            title="Dashboard — KMZ / DWG / GEO"
            description="Acesso central aos arquivos técnicos da empresa."
            setTab={setTab}
          />
        );

      }


    if (
      tab === "dashboard-plataformas"
    ) {

      return (
        <ProjectsSection />
      );

    }



      if (tab === "telecom") {

        return (
          <ClientDocumentsSection
            companyId={companyId}
          />
        );

      }


      if (
        tab === "telecom-kmz-dwg-ged"
      ) {

        // ETAPA35A14A_COMPANY_TELECOM_PLATFORMS
        return <GeoFiberDashboard />;

      }


      if (
        tab === "telecom-crea-cft"
      ) {

        return (

          <div className="space-y-10">

            <CompanyFilesPanel
              companyId={companyId}
              title="CREA / ART"
              description="Anotações de Responsabilidade Técnica e documentação profissional vinculada ao CREA."
              defaultCategory="ART"
            />

            <CompanyFilesPanel
              companyId={companyId}
              title="CFT / TRT"
              description="Documentação CFT, TRT e registros técnicos."
              defaultCategory="TRT"
            />

          </div>

        );

      }


    if (tab === "arquivos") {
      return (
        <ClientDocumentsSection
          companyId={companyId}
        />
      );
    }

    if (
      tab === "arquivos-documentos"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="Documentos"
          description="Documentos gerais da empresa."
          defaultCategory="Documentos"
        />
      );

    }


    if (
      tab === "arquivos-contabilidade"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="Contabilidade"
          description="Documentação contábil da empresa."
          defaultCategory="CONTABILIDADE"
        />
      );

    }


    if (
      tab === "arquivos-feninfra"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="Feninfra"
          description="Documentos e acesso ao portal Feninfra."
          defaultCategory="FENINFRA"
          external="feninfra"
        />
      );

    }


    if (
      tab === "arquivos-anatel"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="Anatel / Enel"
          description="Documentos regulatórios e acessos externos."
          defaultCategory="ANATEL"
          external="anatel-enel"
        />
      );

    }


    if (
      tab === "arquivos-cft"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="CFT / TRT / ART"
          description="Documentação técnica profissional da empresa."
          defaultCategory="TRT"
        />
      );

    }


    if (
      tab === "arquivos-certidoes"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="Certidões"
          description="Certidões e documentos de regularidade."
          defaultCategory="CERTIDOES"
        />
      );

    }


    if (
      tab === "arquivos-dwg"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="DWG"
          description="Projetos e desenhos técnicos DWG."
          defaultCategory="DWG"
        />
      );

    }


    if (
      tab === "arquivos-kmz"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="KMZ"
          description="Arquivos geográficos KMZ/KML da empresa."
          defaultCategory="KMZ"
        />
      );

    }


    if (
      tab === "arquivos-ged"
    ) {

      return (
        <CompanyFilesPanel
          companyId={companyId}
          title="GED"
          description="Gestão eletrônica dos documentos da empresa."
        />
      );

    }


      if (
        tab === "projetos-kmz-dwg-ged"
      ) {
        // ETAPA35A11C2D_PROJECTS_MATCH_DASHBOARD
        return (
          <ProjectsSection />
        );
      }


    if (tab === "projetos") {
      return <ProjectsSection />;
    }
    if (
      tab === "projetos-plataformas"
    ) {

      return (
        <ProjectsSection />
      );

    }


    if (
      tab === "projetos-kmz"
    ) {

      return (
        <KmzPage />
      );

    }


    if (
      tab === "projetos-geomaps"
    ) {

      return (
        <MapsPageImpl />
      );

    }


      if (tab === "seguranca") {

        return (
          <CompanySafetyHome
            setTab={setTab}
          />
        );

      }


      if (
        tab === "seguranca-normas"
      ) {

        return (
          <CompanyTrainingDetail
            kind="normas"
          />
        );

      }


      if (
        tab === "seguranca-sst"
      ) {

        return (
          <CompanySstDetail companyId={companyId} />
        );

      }


      if (tab === "treinamentos") {
        return (
          <CompanyTrainingHome
            setTab={setTab}
          />
        );
      }

      if (
        tab === "treinamentos-normas"
      ) {
        return (
          <CompanyTrainingDetail
            kind="normas"
          />
        );
      }

      if (
        tab === "treinamentos-telecom"
      ) {
        return (
          <CompanyTrainingDetail
            kind="telecom"
          />
        );
      }


      if (
        tab === "execucao-kmz-dwg-ged"
      ) {

        // ETAPA35A14A_COMPANY_EXECUTION_PLATFORMS
        return <GeoFiberDashboard />;

      }


    if (
      tab === "execucao-checklist"
    ) {

      return (
        <ChecklistPage />
      );

    }


    if (
      tab === "execucao-ferramentas"
    ) {

      return (
        <FerramentasView
          tenantCompanyId={
            companyId
          }
          tenantCompanyName={
            company?.name
          }
        />
      );

    }

      if (
        tab === "execucao-mapas"
      ) {
        return (
          <MapsPageImpl />
        );
      }

      if (
        tab === "execucao-tecnico"
      ) {
        return (
          <TechniciansPage />
        );
      }

      if (
        tab === "execucao-carro"
      ) {
        return (
          <TenantCarroPage
              companyName={
                company?.name
              }
            />
        );
      }

      if (tab == "execucao") {
        return <ExecutionDashboard />;
    }

    if (
      tab === "configuracoes-permissoes"
    ) {

      return (
        <AdminDelegatedPermissions />
      );

    }


    if (tab == "configuracoes") {
      return <SettingsPage />;
    }

    if (tab === "financeiro") {
      return <FinanceSection />;
    }

    /*
     * ETAPA35E12_COMPANY_USERS_TAB
     *
     * Usuários tenant permanecem
     * dentro do ClientLayout.
     */
    if (
      tab === "empresa-usuarios"
    ) {

      return (
        <UsersManager />
      );

    }

        /*
     * ETAPA35A15B_ALVARA_AVCB
     *
     * Documento global publicado por
     * ROOT / MASTER.
     *
     * ADMIN não possui upload.
     */
    if (
      tab === "empresa-alvara-avcb"
    ) {

      return (
        <AlvaraAvcbGlobalManager
          mode="company"
          companyId={companyId}
        />
      );

    }


if (tab == "empresa") {

      return (
        <CompanyProfileEditor
            companyId={companyId}
          />
      );
    }

    return (
      <DashboardSection
        company={company}
      />
    );
  }

  return (
    <ClientLayout
      company={company}
      tab={tab}
      setTab={setTab}
    >
      <>
        {renderContent()}

        <footer
          className="
            border-t
            border-slate-800
            px-6
            py-4
            text-sm
            text-slate-500
          "
        >
          © 2025 GeoFiber Enterprise Platform
        </footer>
      </>
    </ClientLayout>
  );
}
