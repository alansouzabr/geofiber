"use client";

import React from "react";
import {
  Building2,
  Users,
  Map,
  RadioTower,
  Box,
  Cable,
  FileText,
  Settings,
  X,
  Wrench,
  Layers,
  ClipboardList,
  LayoutDashboard,
  PlusSquare,
  Network,
  UserCircle2,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type MenuItem = {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
};

const cadastros: MenuItem[] = [
  { title: "Clientes", desc: "Cadastro e gestão de clientes.", href: "/dashboard", icon: <Users size={16} /> },
  { title: "Caixa de emenda", desc: "Gerencie caixas e pontos da rede.", href: "/dashboard", icon: <Box size={16} /> },
  { title: "Tipos de cabos", desc: "Defina tipos e padrões de cabo.", href: "/dashboard", icon: <Cable size={16} /> },
  { title: "Equipamentos", desc: "Cadastre ativos e equipamentos.", href: "/pop", icon: <RadioTower size={16} /> },
  { title: "Racks", desc: "Gerencie racks e estrutura.", href: "/pop", icon: <Layers size={16} /> },
  { title: "Terminal atendimento", desc: "Organização de terminais.", href: "/dashboard", icon: <Network size={16} /> },
  { title: "Empresas", desc: "Gestão de empresas.", href: "/empresas", icon: <Building2 size={16} /> },
  { title: "Usuários", desc: "Gestão de usuários.", href: "/usuarios", icon: <UserCircle2 size={16} /> },
  { title: "Nova company", desc: "Cadastrar nova company.", href: "/companies/new", icon: <PlusSquare size={16} /> },
];

const funcoes: MenuItem[] = [
  { title: "Consultas e Relatórios", desc: "Consultas e relatórios do sistema.", href: "/dashboard", icon: <ClipboardList size={16} /> },
  { title: "Mapa", desc: "Ambiente GeoFiber Maps.", href: "/dashboard", icon: <Map size={16} /> },
  { title: "Viabilidade", desc: "Simulação e estudo de rede.", href: "/dashboard", icon: <Wrench size={16} /> },
  { title: "Companies", desc: "Listagem técnica de companies.", href: "/companies", icon: <Building2 size={16} /> },
  { title: "Registrar empresa", desc: "Cadastro inicial de empresa.", href: "/register-company", icon: <FileText size={16} /> },
  { title: "Sistema", desc: "Parâmetros e configurações.", href: "/root/companies", icon: <Settings size={16} /> },
];

function go(href: string) {
  window.location.href = href;
}

function Card({ item }: { item: MenuItem }) {
  return (
    <button
      type="button"
      onClick={() => go(item.href)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        width: "100%",
        padding: 12,
        borderRadius: 8,
        border: "1px solid #cfcfcf",
        background: "#efefef",
        cursor: "pointer",
        textAlign: "left",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          display: "grid",
          placeItems: "center",
          background: "#ffffff",
          border: "1px solid #d8d8d8",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>

      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontWeight: 900, fontSize: 13, color: "#2a2a2a" }}>{item.title}</span>
        <span style={{ fontSize: 11, color: "#555" }}>{item.desc}</span>
      </span>
    </button>
  );
}

export default function GeoFiberSystemMenu({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9000,
        background: "rgba(0,0,0,0.28)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1060px, 96vw)",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #8d8d8d",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          background: "#dcdcdc",
        }}
      >
        <div
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
            background: "linear-gradient(90deg,#8f008f,#a90097)",
            color: "white",
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          <span>Menu do sistema</span>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.55)",
              color: "#333",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "190px 1fr",
            minHeight: 470,
          }}
        >
          <aside
            style={{
              borderRight: "1px solid #c9c9c9",
              padding: 14,
              background: "#d8d8d8",
            }}
          >
            <div style={sideBlockTitle}>Início</div>
            <div style={sideActive}>Início</div>

            <div style={{ ...sideBlockTitle, marginTop: 16 }}>Minha conta</div>
            <div style={sideItem} onClick={() => go("/empresa")}>Meus dados</div>

            <div style={{ ...sideBlockTitle, marginTop: 16 }}>Configurações</div>
            <div style={sideItem} onClick={() => go("/root/companies")}>Sistema</div>
            <div style={sideItem} onClick={() => go("/dashboard")}>Mapa</div>
          </aside>

          <section style={{ padding: 14, display: "flex", flexDirection: "column", gap: 18, background: "#dcdcdc" }}>
            <div>
              <div style={sectionTitle}>Cadastros</div>
              <div style={gridStyle}>
                {cadastros.map((item) => (
                  <Card key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div>
              <div style={sectionTitle}>Funções</div>
              <div style={gridStyle}>
                {funcoes.map((item) => (
                  <Card key={item.title} item={item} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 900,
  color: "#414141",
  marginBottom: 8,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 10,
};

const sideBlockTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 900,
  color: "#666",
  marginBottom: 6,
};

const sideItem: React.CSSProperties = {
  fontSize: 13,
  color: "#2c2c2c",
  padding: "10px 12px",
  borderRadius: 6,
  cursor: "pointer",
  background: "#d0d0d0",
  marginBottom: 8,
};

const sideActive: React.CSSProperties = {
  fontSize: 13,
  color: "#1f1f1f",
  padding: "10px 12px",
  borderRadius: 6,
  cursor: "pointer",
  background: "#ececec",
  marginBottom: 8,
  fontWeight: 900,
};