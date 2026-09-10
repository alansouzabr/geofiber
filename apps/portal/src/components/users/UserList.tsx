"use client";

import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);

  async function load() {
    const token = localStorage.getItem("token");

    const res = await fetch("https://api.geofibers.com.br/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Usuários</h2>

      {users.map((u) => (
        <div key={u.id}>
          <b>{u.name}</b><br />
          {u.email}
        </div>
      ))}
    </div>
  );
}
