export default function App() {
  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header
        className="mx-auto mt-4 w-[96%] rounded-2xl px-6 py-4 shadow"
        style={{ background: "linear-gradient(90deg,var(--gf-blue-900),var(--gf-blue-700))" }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-white">
            <div className="text-2xl font-extrabold tracking-tight">
              <span style={{ color: "var(--gf-green)" }}>Geo</span>Fiber Maps
            </div>
            <div className="text-sm opacity-90">
              Next Generation High Fiber Optical • Documentação e Operação de Rede
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Novo Projeto", "Carregar", "Salvar", "Exportar Excel"].map((t) => (
              <button
                key={t}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto mt-6 w-[96%] pb-8">
        <div className="grid grid-cols-12 gap-4">
          {/* Left panel */}
          <section className="col-span-12 lg:col-span-3">
            <Panel title="Elementos da Rede" dot="var(--gf-green)">
              <div className="grid grid-cols-2 gap-3">
                <CardStat label="Total" value="0" />
                <CardStat label="Cabos (km)" value="0.0" />
                <CardStat label="Operacionais" value="0" />
                <CardStat label="Com Falha" value="0" />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 rounded-xl px-3 py-2 text-sm font-bold text-white"
                  style={{ background: "var(--gf-green)" }}
                >
                  + Adicionar
                </button>
                <button className="flex-1 rounded-xl bg-red-500 px-3 py-2 text-sm font-bold text-white hover:bg-red-600">
                  Limpar
                </button>
              </div>

              <div
                className="mt-4 h-48 rounded-xl border p-3 text-sm"
                style={{ borderColor: "var(--gf-border)", color: "var(--gf-muted)" }}
              >
                Nenhum elemento adicionado.
                <div className="mt-2 text-xs">
                  Use o Editor ao lado para adicionar elementos à sua rede.
                </div>
              </div>
            </Panel>
          </section>

          {/* Center map */}
          <section className="col-span-12 lg:col-span-6">
            <Panel
              title="Mapa da Rede"
              dot="var(--gf-cyan)"
              right={
                <button
                  className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                  style={{ borderColor: "var(--gf-border)" }}
                >
                  Visão Geral
                </button>
              }
            >
              <div
                className="h-[540px] rounded-xl border"
                style={{
                  borderColor: "var(--gf-border)",
                  background: "linear-gradient(180deg, rgba(15,74,154,0.06), rgba(255,255,255,1))",
                }}
              >
                <div className="flex h-full items-center justify-center text-sm" style={{ color: "var(--gf-muted)" }}>
                  (Aqui entra o Leaflet/Mapbox depois)
                </div>
              </div>
            </Panel>
          </section>

          {/* Right editor */}
          <section className="col-span-12 lg:col-span-3">
            <Panel title="Editor" dot="var(--gf-blue-700)">
              <div className="grid grid-cols-3 gap-2">
                <ToolButton label="Selecionar" active />
                <ToolButton label="Marcador" />
                <ToolButton label="Linha" />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {["OLT", "Splitter", "ONU", "Cabo", "Poste", "Emenda"].map((t) => (
                  <button
                    key={t}
                    className="rounded-xl border px-3 py-3 text-sm font-extrabold hover:bg-slate-50"
                    style={{ borderColor: "var(--gf-border)", color: "var(--gf-blue-800)" }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <Field label="Nome do Elemento *" placeholder="Ex: OLT Central" />
                <Select
                  label="Tipo *"
                  options={[
                    "OLT (Optical Line Terminal)",
                    "Splitter",
                    "ONU/Cliente",
                    "Cabo Óptico",
                    "Caixa de Emenda",
                    "Rack/ODF",
                  ]}
                />
                <Select label="Status *" options={["Operacional", "Com Falha", "Em implantação"]} />
              </div>

              <div className="mt-4 rounded-xl border p-3 text-xs" style={{ borderColor: "var(--gf-border)" }}>
                <div className="font-extrabold" style={{ color: "var(--gf-blue-800)" }}>
                  Legenda
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2" style={{ color: "var(--gf-muted)" }}>
                  <LegendItem color="#2563EB" label="Cabo Óptico" />
                  <LegendItem color="#10B981" label="OLT / Splitter" />
                  <LegendItem color="#06B6D4" label="ONU / Cliente" />
                  <LegendItem color="#F97316" label="Poste / Infra" />
                </div>
              </div>
            </Panel>
          </section>
        </div>
      </main>
    </div>
  );
}

function Panel({
  title,
  dot,
  right,
  children,
}: {
  title: string;
  dot: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm" style={{ borderColor: "var(--gf-border)" }}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: dot }} />
          <h2 className="text-sm font-extrabold" style={{ color: "var(--gf-blue-800)" }}>
            {title}
          </h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function CardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: "var(--gf-border)" }}>
      <div className="text-xs font-bold" style={{ color: "var(--gf-muted)" }}>
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold" style={{ color: "var(--gf-blue-800)" }}>
        {value}
      </div>
    </div>
  );
}

function ToolButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className="rounded-xl px-3 py-3 text-sm font-extrabold"
      style={{
        background: active ? "var(--gf-blue-700)" : "#F1F5F9",
        color: active ? "white" : "var(--gf-blue-800)",
      }}
    >
      {label}
    </button>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-extrabold" style={{ color: "var(--gf-muted)" }}>
        {label}
      </label>
      <input
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2"
        style={{ borderColor: "var(--gf-border)" }}
        placeholder={placeholder}
      />
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-extrabold" style={{ color: "var(--gf-muted)" }}>
        {label}
      </label>
      <select
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none"
        style={{ borderColor: "var(--gf-border)" }}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
