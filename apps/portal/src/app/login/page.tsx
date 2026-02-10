import Link from 'next/link';
import { AuthCard } from '@/components/AuthCard';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <AuthCard
        title="Entrar"
        subtitle="Acesse sua conta para gerenciar sua empresa e operações."
      >
        <form className="space-y-4">
          <input className="input" placeholder="E-mail" />
          <input className="input" type="password" placeholder="Senha" />
          <button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-black text-black"
          >
            Entrar
          </button>

          <div className="flex justify-between text-sm opacity-80">
            <Link href="/register-company">Cadastrar empresa</Link>
          </div>
        </form>
      </AuthCard>
    </main>
  );
}
