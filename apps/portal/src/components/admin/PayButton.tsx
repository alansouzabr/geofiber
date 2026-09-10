"use client";

export default function PayButton({ priceId, companyId }: any) {
  async function pay() {
    const res = await fetch("https://api.geofibers.com.br/billing/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ priceId, companyId }),
    });

    const data = await res.json();

    window.location.href = data.url;
  }

  return (
    <button
      onClick={pay}
      style={{
        padding: "12px 20px",
        background: "#6366f1",
        borderRadius: 8,
        border: "none",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Assinar Plano
    </button>
  );
}
