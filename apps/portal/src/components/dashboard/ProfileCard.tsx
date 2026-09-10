"use client";

import styles from "@/app/dashboard/[company]/dashboard.module.css";

import {
  Building2,
  User,
  Save
} from "lucide-react";

export default function ProfileCard({
  company
}: any) {

  return (

    <div className={styles.profileCard}>

      <div className={styles.cardHeader}>

        <div>

          <div className={styles.cardTitle}>
            Editar Dados da Empresa e Usuário
          </div>

          <div className={styles.cardSub}>
            Atualize as informações da empresa e sua conta.
          </div>

        </div>

      </div>

      <div className={styles.divider} />

      <div className={styles.profileGrid}>

        <div>

          <div className={styles.sectionTitle}>
            <Building2 size={18} />
            Dados da Empresa
          </div>

          <div className={styles.formGroup}>
            <label>Nome da Empresa</label>
            <input defaultValue="TESTE1 TELECOM" />
          </div>

          <div className={styles.formGroup}>
            <label>Razão Social</label>
            <input defaultValue="TESTE1 TELECOM LTDA" />
          </div>

          <div className={styles.formGroup}>
            <label>CNPJ</label>
            <input defaultValue="12.345.678/0001-99" />
          </div>

        </div>

        <div>

          <div className={styles.sectionTitle}>
            <User size={18} />
            Dados do Administrador
          </div>

          <div className={styles.formGroup}>
            <label>Nome do Usuário</label>
            <input defaultValue="Administrador TESTE1" />
          </div>

          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input defaultValue="teste1@teste1.com" />
          </div>

          <div className={styles.formGroup}>
            <label>WhatsApp</label>
            <input defaultValue="(11) 99999-9999" />
          </div>

          <div className={styles.formGroup}>
            <label>Nova Senha</label>
            <input
              type="password"
              placeholder="Deixe em branco para manter"
            />
          </div>

        </div>

      </div>

      <button className={styles.saveButton}>

        <Save size={18} />

        Salvar Alterações

      </button>

      <div className={styles.securityText}>
        🔒 Seus dados estão protegidos e criptografados.
      </div>

    </div>
  );
}
