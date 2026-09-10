"use client";

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MrrChart({ data }: any) {
  return (
    <div style={{
      background: "#111827",
      padding: 20,
      borderRadius: 12
    }}>
      <h3 style={{ marginBottom: 20 }}>MRR Growth</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="mrr"
            stroke="#6366f1"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
