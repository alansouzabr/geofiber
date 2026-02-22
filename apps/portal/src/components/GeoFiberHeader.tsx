import styles from './GeoFiberHeader.module.css';

export default function GeoFiberHeader() {
  return (
    <div className={styles.wrap}>
      <div className={styles.brand}>
        <div className={styles.logoWrap} aria-hidden="true">
          <div className={styles.logoGlow} />
          <div className={styles.logo}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <defs>
                <linearGradient id="gfInk" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#001018" stopOpacity="0.92" />
                  <stop offset="1" stopColor="#001018" stopOpacity="0.74" />
                </linearGradient>
              </defs>

              <path
                d="M4 12c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0"
                stroke="url(#gfInk)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M4 16c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0"
                stroke="url(#gfInk)"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M4 8c2.2-2 4.4-2 6.6 0s4.4 2 6.6 0"
                stroke="url(#gfInk)"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.75"
              />

              <circle cx="18.2" cy="6.2" r="1.6" fill="url(#gfInk)" opacity="0.9" />
            </svg>
          </div>
        </div>

        <div className={styles.titleBlock}>
          <h2 className={styles.title}>GeoFiber Maps-Next Generation</h2>
          <div className={styles.sub}>Sistema completo para documentação e gestão de redes</div>
        </div>
      </div>

      <div className={styles.badgeRow}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          Fiber • GIS • Ops
        </span>
      </div>
    </div>
  );
}
