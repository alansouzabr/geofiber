'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

export default function NewCompany() {
  const router = useRouter()
  const [name, setName] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    await apiFetch('/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })

    router.push('/companies')
  }

  return (
    <form onSubmit={submit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Salvar</button>
    </form>
  )
}
