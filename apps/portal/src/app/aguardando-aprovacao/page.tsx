export default function PendingApprovalPage() {

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#020617 0%,#071126 50%,#001b1f 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 24,
          padding: 40,
          color: "white",
          boxShadow: "0 0 40px rgba(0,0,0,0.45)"
        }}
      >
        <h1
          style={{
            color: "#22d3ee",
            fontSize: 42,
            marginBottom: 20,
            fontWeight: "bold"
          }}
        >
          Cadastro recebido
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.7,
            color: "#cbd5e1",
            marginBottom: 20
          }}
        >
          Sua empresa está em análise e será aprovada em breve.
        </p>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: 30,
            fontSize: 16
          }}
        >
          Aguarde aprovação do administrador GeoFiber.
        </p>

        <div
          style={{
            background: "#020617",
            border: "1px solid #1e293b",
            borderRadius: 18,
            padding: 24,
            marginBottom: 30
          }}
        >
          <h2
            style={{
              color: "#22d3ee",
              marginBottom: 18,
              fontSize: 22
            }}
          >
            Após aprovação:
          </h2>

          <div
            style={{
              display: "grid",
              gap: 14,
              color: "#e2e8f0",
              fontSize: 16
            }}
          >
            <div>✔ Acesso ao painel Dashboard</div>
            <div>✔ ART / TRT</div>
            <div>✔ Downloads técnicos</div>
            <div>✔ Mapas</div>
            <div>✔ Projetos</div>
          </div>
        </div>

        <a
          href="https://wa.me/5511979714030"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            textAlign: "center",
            background: "#22c55e",
            color: "white",
            padding: 18,
            borderRadius: 14,
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 18
          }}
        >
          WhatsApp Suporte
        </a>
      </div>
    </main>
  );
}
