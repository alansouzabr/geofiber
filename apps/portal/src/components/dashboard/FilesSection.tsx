"use client";

import {
  useEffect,
  useState
} from "react";

import styles from "@/app/dashboard/[company]/dashboard.module.css";

import {
  Download,
  FileText,
  Send,
  FolderOpen
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL;

interface CompanyFile {

  id: string;

  name: string;

  url: string;

  category?: string;

  month?: string;

  year?: string;

  createdAt?: string;
}

export default function FilesSection() {

  const [message, setMessage] =
    useState("");

  const [files, setFiles] =
    useState<CompanyFile[]>([]);

  const [timeline, setTimeline] =
    useState<any>({});

  async function loadFiles() {

    try {

      const companyId =
        localStorage.getItem(
          "geofiber_companyId"
        );

      if (!companyId) {
        return;
      }

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(
          API +
          "/company-files/" +
          companyId,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await res.json();

      setFiles(data);

    } catch (err) {

      console.error(err);
    }
  }

  async function loadTimeline() {

    try {

      const companyId =
        localStorage.getItem(
          "geofiber_companyId"
        );

      if (!companyId) {
        return;
      }

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(
          API +
          "/company-files/timeline/" +
          companyId,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await res.json();

      setTimeline(data);

    } catch (err) {

      console.error(err);
    }
  }

  useEffect(() => {

    loadFiles();

    loadTimeline();

  }, []);

  function sendRequest() {

    alert(
      "Solicitação enviada ao Admin Master."
    );

    setMessage("");
  }

  return (

    <div className={styles.filesCard}>

      <div className={styles.cardTitle}>
        GED Enterprise
      </div>

      <div className={styles.cardSub}>
        Timeline documental da empresa
      </div>

      <div
        style={{
          display: "grid",
          gap: 20,
          marginTop: 30
        }}
      >

        {Object.entries(timeline || {}).map(
          ([month, data]: any) => (

            <div
              key={month}
              className={styles.fileItem}
              style={{
                flexDirection: "column",
                alignItems: "flex-start"
              }}
            >

              <div
                style={{
                  width: "100%"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14
                    }}
                  >

                    <div
                      className={
                        styles.fileIcon
                      }
                    >

                      <FolderOpen
                        size={22}
                      />

                    </div>

                    <div>

                      <div
                        className={
                          styles.fileName
                        }
                      >
                        {month}
                      </div>

                      <div
                        className={
                          styles.filePath
                        }
                      >
                        {data.total}
                        {" "}
                        arquivos
                      </div>

                    </div>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: 18,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap"
                  }}
                >

                  {Object.entries(data.categories || {}).map(
                    ([category, total]: any) => (

                      <div
                        key={category}
                        style={{
                          padding:
                            "10px 14px",
                          borderRadius: 14,
                          background:
                            "#111c33",
                          border:
                            "1px solid #22304d",
                          fontSize: 14,
                          fontWeight: 700
                        }}
                      >
                        {category.toUpperCase()}
                        {" "}
                        ({String(total)})
                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )
        )}

      </div>

      <div className={styles.filesList}>

        {files.map((file) => (

          <div
            key={file.id}
            className={styles.fileItem}
          >

            <div className={styles.fileLeft}>

              <div className={styles.fileIcon}>
                <FileText size={22} />
              </div>

              <div>

                <div className={styles.fileName}>
                  {file.name}
                </div>

                <div className={styles.filePath}>

                  {file.month}
                  {" • "}
                  {file.category}

                </div>

              </div>

            </div>

            <a
              href={file.url}
              target="_blank"
              className={styles.downloadButton}
            >

              <Download size={16} />

              Baixar

            </a>

          </div>

        ))}

      </div>

      <div
        style={{
          marginTop: 30
        }}
      >

        <div className={styles.sectionTitle}>
          Solicitações
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Solicite novos arquivos, ARTs, projetos ou suporte."
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
        />

        <button
          className={styles.saveButton}
          onClick={sendRequest}
        >

          <Send size={18} />

          Enviar Solicitação

        </button>

      </div>

    </div>
  );
}
