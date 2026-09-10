"use client";

import styles from "@/app/dashboard/[company]/dashboard.module.css";

export default function TrtSection() {

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio"
  ];

  return (

    <div className={styles.profileCard}>

      <div className={styles.cardTitle}>
        ARTs e TRTs Mensais
      </div>

      <div className={styles.cardSub}>
        Controle documental mensal.
      </div>

      <div className={styles.filesList}>

        {months.map((month) => (

          <div
            key={month}
            className={styles.fileItem}
          >

            <div>

              <div className={styles.fileName}>
                TRT / ART
              </div>

              <div className={styles.filePath}>
                {month} 2025
              </div>

            </div>

            <button className={styles.downloadButton}>
              Baixar
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}
