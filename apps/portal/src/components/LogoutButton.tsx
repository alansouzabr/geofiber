'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('https://api.geofibers.com.br/auth/logout', { method: 'POST' })
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: 20,
        padding: '10px 20px',
        background: '#8f008f',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer'
      }}
    >
      Sair
    </button>
  )
}
