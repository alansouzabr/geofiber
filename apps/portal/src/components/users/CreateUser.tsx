"use client";

import { useState } from "react";

export default function CreateUser({ onCreated }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleCreate() {
    const token = localStorage.getItem("token");

    const res = await fetch("https://api.geofibers.com.br/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Usuário criado 🚀");
      setName("");
      setEmail("");
      setPassword("");
      onCreated?.();
    } else {
      alert(data.message || "Erro ao criar usuário");
    }
  }

  return (
    <div>
      <h3>Criar usuário</h3>

      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
      <br /><br />

      <button onClick={handleCreate}>Criar</button>
    </div>
  );
}
