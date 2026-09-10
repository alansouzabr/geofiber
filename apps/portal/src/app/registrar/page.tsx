"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrarPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    email: "",
    password: "",
  });

  function formatWhatsapp(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;

    if (e.target.name === "whatsapp") {
      value = formatWhatsapp(value);
    }

    setForm({
      ...form,
      [e.target.name]: value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      console.log(
        "REGISTER URL",
        process.env.NEXT_PUBLIC_API_URL + "/auth/register"
      );

      console.log(
        "REGISTER DATA",
        form
      );

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message || "Erro ao registrar"
        );

        return;
      }

      router.push(
        "/aguardando-aprovacao"
      );

    } catch (err: any) {
      console.error(
        "REGISTER ERROR",
        err
      );

      alert(
        err?.message ||
        String(err)
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background:
          "linear-gradient(135deg,#020617 0%,#071126 50%,#001b1f 100%)",

        padding: "48px 20px",

        boxSizing: "border-box",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,

          background: "#0f172a",

          border:
            "1px solid #1e293b",

          borderRadius: 20,

          padding:
            "42px 44px",

          boxShadow:
            "0 0 40px rgba(0,0,0,0.5)",

          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              color: "#22d3ee",

              fontSize: 30,

              margin:
                "0 0 12px 0",

              fontWeight: "bold",

              lineHeight: 1.2,
            }}
          >
            Cadastro GeoFiber
          </h1>

          <p
            style={{
              color: "#94a3b8",

              lineHeight: 1.6,

              fontSize: 14,

              margin: 0,

              maxWidth: 580,

              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Plataforma GeoFiber Enterprise
            para gestão de mapas, projetos,
            TRT/ART e operações telecom.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 18,
          }}
        >
          <label
            style={{
              display: "flex",

              flexDirection: "column",

              gap: 8,

              color: "#cbd5e1",

              fontSize: 13,

              fontWeight: "bold",
            }}
          >
            Nome

            <input
              className="gf-register-input"
              name="name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",

                boxSizing: "border-box",

                background: "#020617",

                border:
                  "1px solid #1e293b",

                color: "white",

                padding:
                  "14px 15px",

                borderRadius: 10,

                fontSize: 15,

                outline: "none",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",

              flexDirection: "column",

              gap: 8,

              color: "#cbd5e1",

              fontSize: 13,

              fontWeight: "bold",
            }}
          >
            WhatsApp

            <input
              className="gf-register-input"
              name="whatsapp"
              type="tel"
              placeholder="(11) 99999-9999"
              autoComplete="tel"
              value={form.whatsapp}
              onChange={handleChange}
              required
              style={{
                width: "100%",

                boxSizing: "border-box",

                background: "#020617",

                border:
                  "1px solid #1e293b",

                color: "white",

                padding:
                  "14px 15px",

                borderRadius: 10,

                fontSize: 15,

                outline: "none",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",

              flexDirection: "column",

              gap: 8,

              color: "#cbd5e1",

              fontSize: 13,

              fontWeight: "bold",
            }}
          >
            Email

            <input
              className="gf-register-input"
              name="email"
              type="email"
              placeholder="voce@empresa.com"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",

                boxSizing: "border-box",

                background: "#020617",

                border:
                  "1px solid #1e293b",

                color: "white",

                padding:
                  "14px 15px",

                borderRadius: 10,

                fontSize: 15,

                outline: "none",
              }}
            />
          </label>

          <label
            style={{
              display: "flex",

              flexDirection: "column",

              gap: 8,

              color: "#cbd5e1",

              fontSize: 13,

              fontWeight: "bold",
            }}
          >
            Senha

            <input
              className="gf-register-input"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",

                boxSizing: "border-box",

                background: "#020617",

                border:
                  "1px solid #1e293b",

                color: "white",

                padding:
                  "14px 15px",

                borderRadius: 10,

                fontSize: 15,

                outline: "none",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              width: "100%",

              marginTop: 2,

              background:
                "linear-gradient(90deg,#22d3ee 0%,#00d9a6 100%)",

              color: "#020617",

              border: "none",

              padding: "15px 18px",

              borderRadius: 12,

              fontWeight: "bold",

              fontSize: 16,

              cursor: "pointer",

              boxSizing: "border-box",
            }}
          >
            Solicitar acesso
          </button>
        </form>

        <div
          style={{
            marginTop: 30,

            paddingTop: 20,

            borderTop:
              "1px solid #1e293b",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            gap: 28,

            flexWrap: "wrap",

            textAlign: "center",
          }}
        >
          <a
            href="/login"
            style={{
              color: "#94a3b8",

              fontSize: 13,

              textDecoration: "none",
            }}
          >
            Já possui conta?
          </a>

          <a
            href="https://wa.me/5511979714030"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#94a3b8",

              fontSize: 13,

              textDecoration: "none",
            }}
          >
            WhatsApp Suporte
          </a>
        </div>
      </div>

      <style jsx>{`
        .gf-register-input::placeholder {
          color: #64748b;
        }

        .gf-register-input:focus {
          border-color: #22d3ee !important;
          box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.12);
        }

        button:hover {
          filter: brightness(1.05);
        }

        @media (max-width: 600px) {
          main {
            padding: 24px 14px !important;
          }

          main > div {
            padding: 30px 22px !important;
            border-radius: 18px !important;
          }

          h1 {
            font-size: 27px !important;
          }
        }
      `}</style>
    </main>
  );
}
