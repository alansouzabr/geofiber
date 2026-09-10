"use client";

import {
  Building2,
  Clock3,
  Users
} from "lucide-react";

export default function Hero({
  company
}: any) {

  return (

    <div
      style={{
        background:
          "linear-gradient(135deg,#0f172a,#0d1b35)",
        border:
          "1px solid #1d2d50",
        borderRadius: 28,
        padding: 38,
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 30,
        boxShadow:
          "0 0 40px rgba(0,0,0,0.35)"
      }}
    >

      <div
        style={{
          display: "flex",
          gap: 22,
          alignItems: "center"
        }}
      >

        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: 24,
            background:
              "linear-gradient(135deg,#4f46e5,#3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center"
          }}
        >
          <Building2 size={42} />
        </div>

        <div>

          <div
            style={{
              fontSize: 44,
              fontWeight:
                "bold"
            }}
          >
            {company?.name || "Empresa"}

            <span
              style={{
                marginLeft: 14,
                padding:
                  "7px 14px",
                borderRadius: 999,
                background:
                  "#16a34a",
                fontSize: 13
              }}
            >
              ATIVA
            </span>

          </div>

          <div
            style={{
              opacity: 0.7,
              marginTop: 10,
              fontSize: 18
            }}
          >
            Bem-vindo ao seu portal documental
          </div>

        </div>

      </div>

      <div
        style={{
          display: "flex",
          gap: 70
        }}
      >

        <div>

          <div
            style={{
              opacity: 0.6,
              marginBottom: 8
            }}
          >
            Plano Atual
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight:
                "bold"
            }}
          >
            {company?.plan?.name || "Plano"}
          </div>

        </div>

        <div>

          <div
            style={{
              opacity: 0.6,
              marginBottom: 8
            }}
          >
            <Users size={16} />
            Membros
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight:
                "bold"
            }}
          >
            1 / 50
          </div>

        </div>

        <div>

          <div
            style={{
              opacity: 0.6,
              marginBottom: 8
            }}
          >
            <Clock3 size={16} />
            Último acesso
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight:
                "bold"
            }}
          >
            05/05/2025
          </div>

        </div>

      </div>

    </div>
  );
}
