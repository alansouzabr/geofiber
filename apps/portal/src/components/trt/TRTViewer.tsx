"use client";

export default function TRTViewer({ url }: { url: string }) {
  return (
    <div style={{
      border: "1px solid #333",
      borderRadius: 10,
      overflow: "hidden",
      marginTop: 20
    }}>
      <iframe
        src={url}
        width="100%"
        height="600px"
        style={{ border: "none" }}
      />
    </div>
  );
}
