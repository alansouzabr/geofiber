"use client";

import MonthlyDocumentsTable
from "@/components/monthly-documents/MonthlyDocumentsTable";

export default function TRTPage() {

  return (
    <div
      style={{
        padding: 30,
        background: "#0b1220",
        minHeight: "100vh",
        color: "white"
      }}
    >

      <h1
        style={{
          fontSize: 32,
          marginBottom: 20
        }}
      >
        ART / TRT Documents
      </h1>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: 30
        }}
      >
        Downloads mensais da empresa
      </p>

      <MonthlyDocumentsTable />

    </div>
  );
}
