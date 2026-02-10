import AuthShell from '@/components/auth/AuthShell';
import RegisterCompanyForm from './RegisterCompanyForm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RegisterCompanyPage() {
  return (
    <AuthShell
      title="Cadastro PJ Telecom"
      subtitle="Registre sua empresa e defina as operações (FTTH/Backbone/Datacenter). Após aprovação, você poderá gerenciar projetos e técnicos."
    >
      <RegisterCompanyForm />
    </AuthShell>
  );
}
