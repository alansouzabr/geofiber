export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5511979714030"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp GeoFiber"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        zIndex: 9999,
        textDecoration: "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.92.54 3.72 1.47 5.26L2 22l4.9-1.29A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm5.07 14.43c-.21.58-1.23 1.08-1.7 1.15-.44.07-.99.1-1.6-.1-.37-.12-.84-.28-1.45-.54-2.55-1.1-4.21-3.81-4.34-3.99-.13-.18-1.04-1.38-1.04-2.64s.66-1.88.89-2.14c.23-.26.5-.33.66-.33h.48c.15 0 .35-.01.53.42.2.48.67 1.64.73 1.76.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.5.13.25.59.98 1.27 1.58.87.78 1.61 1.03 1.84 1.14.23.11.36.09.49-.06.13-.15.57-.66.72-.89.15-.22.31-.19.52-.11.21.08 1.34.63 1.57.74.23.11.38.16.44.25.06.09.06.52-.15 1.1Z" />
      </svg>
    </a>
  );
}
