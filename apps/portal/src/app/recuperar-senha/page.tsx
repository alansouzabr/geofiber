"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    alert(
      "A recuperação de senha será ativada na próxima etapa."
    );
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
              fontSize: 30,
              marginBottom: 10,
              fontWeight: "bold"
            }}
          >
            Recuperar Senha
          </h1>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.6
            }}
          >
            Informe o e-mail cadastrado para iniciar
            a recuperação do acesso ao GeoFiber Maps.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              background: "#020617",
              border: "1px solid #1e293b",
              color: "white",
              padding: 14,
              borderRadius: 10,
              fontSize: 15
            }}
          />

          <button
            type="submit"
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
            Recuperar Senha
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            textAlign: "center"
          }}
        >
          <Link
            href="/login"
            style={{
              color: "#94a3b8",
              fontSize: 13,
              textDecoration: "none"
            }}
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}
