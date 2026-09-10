"use client";

import "@/styles/auth.css";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(
        {},
        "",
        window.location.pathname
      );
    }
  }, []);

  async function login(e: any) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const loginEmail = String(
      formData.get("email") || ""
    ).trim().toLowerCase();

    const loginPassword = String(
      formData.get("password") || ""
    );

    if (!loginEmail || !loginPassword) {
      alert("Informe e-mail e senha.");
      return;
    }

    try {
      const res = await fetch(
        "https://api.geofibers.com.br/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: loginEmail, password: loginPassword })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Erro no login");
        return;
      }

      if (data.pendingApproval) {
        window.location.href = "/aguardando-aprovacao";
        return;
      }

      document.cookie = `gf_token=${data.token}; path=/; max-age=604800; samesite=lax`;

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(data.user || {}),
          role: data.role
        })
      );

      
const role =
data.role;

const companyId =
  data.user?.companyId;

if (role === "ROOT") {

  window.location.href="/root";
  return;

}

if (role === "MASTER") {

  window.location.href="/master";
  return;

}

if (role === "ADMIN") {

  if (companyId) {
    window.location.href =
      `/admin/${companyId}`;
    return;
  }

  window.location.href="/admin";
  return;

}

window.location.href=
  `/dashboard/${companyId}`;


} catch (err: any) {
        console.error("LOGIN ERROR", err);
        alert(JSON.stringify({ message: err?.message, name: err?.name }));
      }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg,#020617 0%,#071126 50%,#001b1f 100%)",
        padding: 20,
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 0 40px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ marginBottom: 30 }}>
          <h1
            style={{
              color: "#22d3ee",
              fontSize: 34,
              marginBottom: 10,
              fontWeight: "bold"
            }}
          >
            GeoFiber Maps
          </h1>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.6
            }}
          >
            Plataforma Next Generation para gestão de redes,
            emissão de ART/TRT e documentação técnica.
          </p>
        </div>

        <form onSubmit={login}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              background: "#020617",
              border: "1px solid #1e293b",
              color: "white",
              padding: 14,
              borderRadius: 10,
              fontSize: 15
            }}
          />

          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              background: "#020617",
              border: "1px solid #1e293b",
              color: "white",
              padding: 14,
              borderRadius: 10,
              fontSize: 15
            }}
          />

          <button type="submit"
            style={{
              background: "#22d3ee",
              color: "#020617",
              border: "none",
              padding: 14,
              borderRadius: 12,
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            Entrar no Painel
          </button>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 12,
            padding: "0 8px"
          }}
        >
          <a
            href="/recuperar-email"
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
              textDecoration: "none",
              cursor: "pointer"
            }}
          >
            Esqueceu o e-mail?
          </a>

          <a
            href="/recuperar-senha"
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
              textDecoration: "none",
              cursor: "pointer"
            }}
          >
            Esqueceu a senha?
          </a>
        </div>

        <div
          style={{
            marginTop: 30,
            borderTop: "1px solid #1e293b",
            paddingTop: 20
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: 14
            }}
          >
            Pré-lançamento ABRINT 2026
          </p>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 8,
              fontSize: 14
            }}
          >
            Multiempresa • Projetos • TRT • ART • Dashboard SaaS
          </p>
        </div>
      </div>
    </main>
  );
}
