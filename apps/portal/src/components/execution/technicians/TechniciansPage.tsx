"use client";

import { useEffect, useState } from "react";

import {
  listUsers,
  listTechnicians,
  createTechnician
} from "./services/technicians.service";


type User = {
  id: string;
  name: string;
  email: string;
};

type Technician = {
  id: string;
  userId: string;
};

export default function TechniciansPage() {

  const [users, setUsers] = useState<User[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  
useEffect(() => {

  async function load() {

    const u = await listUsers();
    setUsers(Array.isArray(u) ? u : []);

    const t = await listTechnicians();
    setTechnicians(Array.isArray(t) ? t : []);

  }

  load();

}, []);


  function isTechnician(userId: string) {
    return technicians.some(t => t.userId === userId);
  }

  async function defineTechnician(userId: string) {

    await createTechnician({
      userId
    });

    const t = await listTechnicians();

    setTechnicians(
      Array.isArray(t) ? t : []
    );

  }

  return (

    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        Técnicos da Empresa
      </h2>

      <div className="space-y-3">

        {users.map(user => (

          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border border-slate-700 p-4"
          >

            <div>

              <div className="font-semibold text-white">
                {user.name}
              </div>

              <div className="text-sm text-slate-400">
                {user.email}
              </div>

            </div>

            {isTechnician(user.id) ? (

              <button
                disabled
                className="rounded bg-emerald-600 px-4 py-2 text-white opacity-80"
              >
                ✓ Já é Técnico
              </button>

            ) : (

              <button
                className="rounded bg-cyan-500 px-4 py-2 text-white"
                  onClick={() => defineTechnician(user.id)}
              >
                Definir como Técnico
              </button>

            )}

          </div>

        ))}

      </div>

    </div>

  );

}
