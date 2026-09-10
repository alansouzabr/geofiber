import Link from "next/link";
import "@/styles/landing.css";

export default function Home() {
  return (
    <main className="gf-landing"
    >

      {/* HEADER */}
      <header className="gf-header"
      >
        <div>
          <h2
            style={{
              color: "#22d3ee",
              margin: 0,
              fontSize: "clamp(24px,6vw,34px)",
              fontWeight: 800,
              letterSpacing: -1
            }}
          >
            GeoFiber Maps
          </h2>

          <p
            style={{
              marginTop: 4,
              color: "#64748b",
              fontSize: 13
            }}
          >
            Next Generation Platform
          </p>
        </div>

        <div style={{ display: "flex", gap: "clamp(8px,2vw,14px)" }}>

          <Link href="/login">
            <button
              style={{
                background: "transparent",
                border: "1px solid #1e293b",
                color: "white",
                padding: "clamp(10px,2vw,12px) clamp(14px,3vw,20px)",
                borderRadius: 12,
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Entrar
            </button>
          </Link>

          <Link href="/registrar">
            <button
              style={{
                background: "#22d3ee",
                border: "none",
                color: "#020617",
                padding: "clamp(10px,2vw,12px) clamp(14px,3vw,22px)",
                borderRadius: 12,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 0 30px rgba(34,211,238,0.35)"
              }}
            >
              Criar Conta
            </button>
          </Link>

        </div>
      </header>

      {/* HERO */}
      <section className="gf-hero"
      >

        <div
          style={{
            display: "inline-block",
            background: "rgba(34,211,238,0.08)",
            color: "#22d3ee",
            padding: "10px 18px",
            borderRadius: 999,
            marginBottom: 28,
            fontSize: 14,
            border: "1px solid rgba(34,211,238,0.18)"
          }}
        >
          Plataforma SaaS Enterprise • ABRINT 2026
        </div>

        <h1
          style={{
            fontSize: "clamp(26px,5.4vw,64px)",
            lineHeight: 1.08,
            marginBottom: 26,
            fontWeight: 900,
            letterSpacing: -1
          }}
        >
          GeoFiber Maps
          <br />
          Next Generation
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "clamp(16px,4vw,20px)",
            lineHeight: 1.8,
            maxWidth: 860,
            margin: "0 auto 42px"
          }}
        >
          Plataforma profissional para documentação técnica,
          emissão de ART/TRT, gestão de redes ópticas,
          mapa interativo e operação multiempresa.
        </p>

        <div
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <Link href="/registrar">
            <button
              style={{
                background: "#22d3ee",
                color: "#020617",
                border: "none",
                padding: "clamp(14px,3vw,18px) clamp(20px,5vw,36px)",
                borderRadius: 16,
                fontWeight: 800,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 0 35px rgba(34,211,238,0.45)"
              }}
            >
              Começar Agora
            </button>
          </Link>

          <Link href="/login">
            <button
              style={{
                background: "#0f172a",
                color: "white",
                border: "1px solid #1e293b",
                padding: "clamp(14px,3vw,18px) clamp(20px,5vw,36px)",
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 18,
                cursor: "pointer"
              }}
            >
              Painel Admin
            </button>
          </Link>
        </div>

      </section>

      {/* FEATURES */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 28,
          padding: "0 40px 100px",
          maxWidth: 1400,
          margin: "0 auto"
        }}
      >

        <div
          style={{
            background: "rgba(15,23,42,0.9)",
            padding: 34,
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 18 }}>
            🌎
          </div>

          <h3 style={{ fontSize: "clamp(22px,4vw,28px)", marginBottom: 16 }}>
            Mapa Interativo
          </h3>

          <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
            Gerencie postes, cabos, CTOs,
            rotas e ativos ópticos em tempo real.
          </p>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.9)",
            padding: 34,
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 18 }}>
            🏢
          </div>

          <h3 style={{ fontSize: "clamp(22px,4vw,28px)", marginBottom: 16 }}>
            Multiempresa
          </h3>

          <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
            Estrutura enterprise com isolamento de dados,
            RBAC e gerenciamento completo de empresas.
          </p>
        </div>

        <div
          style={{
            background: "rgba(15,23,42,0.9)",
            padding: 34,
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 18 }}>
            📄
          </div>

          <h3 style={{ fontSize: "clamp(22px,4vw,28px)", marginBottom: 16 }}>
            ART / TRT
          </h3>

          <p style={{ color: "#94a3b8", lineHeight: 1.8 }}>
            Solicitação técnica profissional,
            observações detalhadas e download de pedidos.
          </p>
        </div>

      </section>

    </main>
  );
}
