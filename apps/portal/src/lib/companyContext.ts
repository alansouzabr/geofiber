import { apiFetch } from "@/lib/api";
export async function ensureActiveCompany(): Promise<string> {
  const r = await apiFetch('/companies/mine', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Accept': 'application/json' },
  })

  if (!r.ok) {
    const t = await r.text().catch(() => '')
    throw new Error(`failed to load companies: ${r.status} ${t}`)
  }

  const data = await r.json()

  if (!data?.companies?.length) {
    throw new Error('no companies')
  }

  const company = data.companies[0]

  // guarda no browser
  localStorage.setItem('gf_company', company.id)

  return company.id
}
