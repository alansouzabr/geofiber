"use client";

import {
  useState
} from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Receipt,
  CreditCard,
  Menu,
  X,
  Bell,
  LogOut,
  UserCircle2
} from "lucide-react";

import styles
from "@/app/dashboard/[company]/dashboard.module.css";

type Props = {
  activeTab: string;
  setActiveTab: (
    value: string
  ) => void;
};

export default function Header({
  activeTab,
  setActiveTab
}: Props) {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  function logout() {

    localStorage.removeItem("token");

    window.location.href =
      "/login";
  }

  const menus = [

    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard
    },

    {
      id: "arquivos",
      label: "Telecomunicação",
      icon: FolderOpen
    },

    {
      id: "projetos",
      label: "Projetos",
      icon: FileText
    },

    {
      id: "trts",
      label: "TRTs",
      icon: Receipt
    },

    {
      id: "financeiro",
      label: "Financeiro",
      icon: CreditCard
    }
  ];

  return (

    <>

      <header className={styles.header}>

        <div className={styles.logoArea}>

          <div className={styles.logoIcon}>
            🛰️
          </div>

          <div>

            <div className={styles.logoTitle}>
              GeoFibers
            </div>

            <div className={styles.logoSub}>
              Portal Enterprise
            </div>

          </div>

        </div>

        <nav className={styles.centerMenu}>

          {menus.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.id}
                onClick={() =>
                  setActiveTab(item.id)
                }
                className={
                  activeTab === item.id
                  ? styles.navButtonActive
                  : styles.navButton
                }
              >

                <Icon size={18} />

                {item.label}

              </button>
            );
          })}

        </nav>

        <div className={styles.rightMenu}>

          <Bell size={20} />

          <div
            className={styles.userInfo}
            onClick={() =>
              setDropdownOpen(
                !dropdownOpen
              )
            }
          >

            <div className={styles.avatar}>
              T1
            </div>

            <div>

              <div className={styles.userCompany}>
                TESTE1 TELECOM
              </div>

              <div className={styles.userRole}>
                Cliente Enterprise
              </div>

            </div>

          </div>

          <button
            className={styles.mobileMenuButton}
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
          >

            {mobileOpen
              ? <X size={24} />
              : <Menu size={24} />
            }

          </button>

          {dropdownOpen && (

            <div className={styles.dropdownMenu}>

              <button
                className={styles.dropdownItem}
                onClick={() =>
                  setActiveTab("editar")
                }
              >

                <UserCircle2 size={18} />

                Perfil

              </button>

              <button
                className={styles.dropdownLogout}
                onClick={logout}
              >

                <LogOut size={18} />

                Sair

              </button>

            </div>

          )}

        </div>

      </header>

      {mobileOpen && (

        <div className={styles.mobileSidebar}>

          {menus.map((item) => {

            const Icon = item.icon;

            return (

              <button
                key={item.id}
                className={
                  activeTab === item.id
                  ? styles.mobileNavActive
                  : styles.mobileNav
                }
                onClick={() => {

                  setActiveTab(item.id);

                  setMobileOpen(false);
                }}
              >

                <Icon size={18} />

                {item.label}

              </button>

            );
          })}

          <button
            className={styles.mobileLogout}
            onClick={logout}
          >

            <LogOut size={18} />

            Sair

          </button>

        </div>

      )}

    </>

  );
}
