const API = process.env.NEXT_PUBLIC_API_URL!;

function auth() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  };
}

export async function listUsers() {
  const r = await fetch(`${API}/users`, {
    headers: auth()
  });

  return r.json();
}

export async function listTechnicians() {
  const r = await fetch(`${API}/field-technicians`, {
    headers: auth()
  });

  return r.json();
}

export async function createTechnician(data: any) {
  const r = await fetch(`${API}/field-technicians`, {
    method: "POST",
    headers: auth(),
    body: JSON.stringify(data)
  });

  return r.json();
}

export async function updateTechnician(id: string, data: any) {
  const r = await fetch(`${API}/field-technicians/${id}`, {
    method: "PATCH",
    headers: auth(),
    body: JSON.stringify(data)
  });

  return r.json();
}

export async function removeTechnician(id: string) {
  const r = await fetch(`${API}/field-technicians/${id}`, {
    method: "DELETE",
    headers: auth()
  });

  return r.ok;
}
