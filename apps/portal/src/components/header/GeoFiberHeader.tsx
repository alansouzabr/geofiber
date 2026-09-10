import "./GeoFiberHeader.css";
export default function GeoFiberHeader() {
  return (
    <header className="gf-header">
      <div className="gf-left">
        <div className="gf-logo">
          <div className="gf-logo-icon"></div>

          <div className="gf-logo-text">
            <div className="gf-title">GeoFiber Maps</div>
            <div className="gf-subtitle">Next Generation</div>
          </div>
        </div>
      </div>

      <div className="gf-center">
        <input
          className="gf-search"
          placeholder="Buscar endereço"
        />
      </div>

      <div className="gf-right"></div>
    </header>
  );
}
