import { MenuSidebar } from "@/components/menu";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
<div style={{display:"flex"}}><MenuSidebar />
      <div style={{ flex: 1 }}>
        <div style={{flex:1}}>{children}</div></div>
      </div>
    </div>
  );
}
