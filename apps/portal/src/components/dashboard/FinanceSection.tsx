"use client";

import styles from "@/app/dashboard/[company]/dashboard.module.css";

import {
  QrCode
} from "lucide-react";

export default function FinanceSection() {

  return (

    <div className={styles.profileCard}>

      <div className={styles.cardTitle}>
        Financeiro
      </div>

      <div className={styles.cardSub}>
        Pagamentos e assinatura Enterprise.
      </div>

      <div
        style={{
          marginTop: 40,
          textAlign: "center"
        }}
      >

        <div className={styles.qrBox}>

          <QrCode size={120} />

        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 22,
            fontWeight: 700
          }}
        >
          PIX CNPJ
        </div>

        <div
          style={{
            opacity: .7,
            marginTop: 10
          }}
        >
          44.163.219/0001-87
        </div>

        <div
          style={{
            marginTop: 8,
            opacity: .7
          }}
        >
          PixFiber Telecom
        </div>

      </div>

    </div>
  );
}
