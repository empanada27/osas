import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown, ArrowLeft, Share2, Copy } from "lucide-react";
import bdvLogo from "@/imports/logo-bdv.png";
import navBarImage from "@/app/assets/nav-bar-bdv.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* ═══════════════════════════════════════════════════════════
   PALETA EXACTA RGB(33,33,33) = #212121
   ═══════════════════════════════════════════════════════════ */
const BG_MAIN = "#212121";        // Fondo general: RGB(33,33,33)
const FIELD_BG = "#3d3d3d";       // Inputs: más claro para contraste
const BORDER_REST = "#777777";    // Borde reposo
const BORDER_FOCUS = "#a855f7";   // Lila al enfocar
const BTN_PURPLE = "#7e22ce";
const NAV_BG = "#71277a";
const TEXT_MUTED = "#aaaaaa";     // Labels inputs

/* ═══════════════════════════════════════════════════════════
   BANCOS
   ═══════════════════════════════════════════════════════════ */
const BANKS = [
  "0102 - BANCO DE VENEZUELA",
  "0156 - 100% BANCO",
  "0172 - BANCAMIGA BANCO UNIVERSAL, C.A.",
  "0114 - BANCARIBE",
  "0171 - BANCO ACTIVO",
  "0128 - BANCO CARONÍ",
  "0163 - BANCO DEL TESORO",
  "0175 - BANCO DIGITAL DE LOS TRABAJADORES, BANCO UNIVERSAL",
  "0115 - BANCO EXTERIOR",
  "0151 - BANCO FONDO COMÚN",
  "0105 - BANCO MERCANTIL",
  "0191 - BANCO NACIONAL DE CREDITO",
  "0138 - BANCO PLAZA",
  "0137 - BANCO SOFITASA",
  "0104 - BANCO VENEZOLANO DE CREDITO",
  "0168 - BANCRECER",
  "0134 - BANESCO",
  "0177 - BANFANB",
  "0146 - BANGENTE",
  "0174 - BANPLUS",
  "0108 - BBVA PROVINCIAL",
  "0157 - DELSUR BANCO UNIVERSAL",
  "0601 - INSTITUTO MUNICIPAL DE CREDITO POPULAR",
  "0178 - N58 BANCO DIGITAL BANCO MICROFINANCIERO S A",
  "0169 - R4 BANCO MICROFINANCIERO C.A.",
];

interface FormData {
  documento: string;
  banco: string;
  telefono: string;
  monto: string;
  concepto: string;
}

function formatDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/* ═══════════════════════════════════════════════════════════
   OUTLINED INPUT
   ═══════════════════════════════════════════════════════════ */
function OutlinedInput({
  label,
  value,
  onChange,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isActive = focused || hasValue;

  return (
    <div className="relative w-full">
      <span
        className="absolute left-4 pointer-events-none transition-all duration-200"
        style={{
          top: isActive ? "6px" : "50%",
          transform: isActive ? "translateY(0)" : "translateY(-50%)",
          fontSize: isActive ? "0.7rem" : "0.95rem",
          color: focused ? BORDER_FOCUS : TEXT_MUTED,
          zIndex: 2,
        }}
      >
        {label}
      </span>
      <input
        className="w-full text-white outline-none rounded-xl font-light tracking-wide transition-all duration-200"
        style={{
          background: FIELD_BG,
          border: focused ? `2px solid ${BORDER_FOCUS}` : `1.5px solid ${BORDER_REST}`,
          padding: isActive ? "22px 16px 8px" : "16px 16px",
          fontSize: "0.95rem",
        }}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          let v = e.target.value;
          if (inputMode === "numeric") v = v.replace(/\D/g, "");
          if (inputMode === "decimal") {
            v = v.replace(/[^0-9.]/g, "");
            const parts = v.split(".");
            if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");
          }
          if (maxLength) v = v.slice(0, maxLength);
          onChange(v);
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OUTLINED SELECT
   ═══════════════════════════════════════════════════════════ */
function OutlinedSelect({
  label,
  value,
  open,
  onToggle,
  children,
}: {
  label: string;
  value: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left rounded-xl transition-all duration-200 relative"
        style={{
          background: FIELD_BG,
          border: open ? `2px solid ${BORDER_FOCUS}` : `1.5px solid ${BORDER_REST}`,
          padding: "22px 16px 8px",
        }}
      >
        <span
          className="absolute left-4 top-1.5 text-xs pointer-events-none"
          style={{ color: open ? BORDER_FOCUS : TEXT_MUTED }}
        >
          {label}
        </span>
        <span className="flex items-center justify-between text-white text-sm font-light tracking-wide">
          <span>{value}</span>
          <ChevronDown
            size={18}
            style={{
              color: open ? BORDER_FOCUS : TEXT_MUTED,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </span>
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 z-50 overflow-y-auto rounded-xl shadow-2xl"
          style={{
            top: "calc(100% + 6px)",
            background: "#2d2d2d",
            border: `1px solid ${BORDER_REST}`,
            maxHeight: 280,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONOS SVG
   ═══════════════════════════════════════════════════════════ */
function PasteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="8" y="2" width="10" height="4" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="5" y="4" width="14" height="18" rx="2" stroke="white" strokeWidth="1.5" />
      <line x1="9" y1="10" x2="15" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="14" x2="15" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="5" y="5" width="3" height="3" fill="white" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="16" y="5" width="3" height="3" fill="white" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
      <rect x="5" y="16" width="3" height="3" fill="white" />
      <rect x="14" y="14" width="3" height="3" fill="white" />
      <rect x="18" y="14" width="3" height="3" fill="white" />
      <rect x="14" y="18" width="3" height="3" fill="white" />
      <rect x="18" y="18" width="3" height="3" fill="white" />
    </svg>
  );
}

function PersonSearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3.5" stroke="white" strokeWidth="1.5" />
      <path d="M2 20c0-3.5 2.8-6.5 6.5-6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="16" r="3" stroke="white" strokeWidth="1.5" />
      <line x1="19.5" y1="18.5" x2="22" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LimitesIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
      <rect x="16" y="6" width="22" height="36" rx="3" stroke="#a855f7" strokeWidth="1.5" />
      <rect x="20" y="11" width="14" height="24" rx="1.5" stroke="#a855f7" strokeWidth="1.2" />
      <circle cx="27" cy="23" r="6" stroke="#a855f7" strokeWidth="1.3" />
      <line x1="27" y1="19" x2="27" y2="23" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="23" x2="30" y2="23" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="27" cy="38" r="1.5" stroke="#a855f7" strokeWidth="1.2" />
      <path d="M13 40 Q11 45 16 47 L38 47 Q43 47 44 43 Q45 40 42 38" stroke="#a855f7" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <line x1="22" y1="42" x2="22" y2="47" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="42" x2="27" y2="47" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="42" x2="32" y2="47" stroke="#a855f7" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 1: FORMULARIO
   ═══════════════════════════════════════════════════════════ */
function PaymentForm({ onPagar }: { onPagar: (data: FormData) => void }) {
  const [form, setForm] = useState<FormData>({
    documento: "",
    banco: "0102 - BANCO DE VENEZUELA",
    telefono: "",
    monto: "",
    concepto: "",
  });
  const [bankOpen, setBankOpen] = useState(false);
  const bankRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (bankRef.current && !bankRef.current.contains(e.target as Node)) setBankOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="flex flex-col h-full select-none" style={{ background: BG_MAIN }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-2">
        <Bell size={20} style={{ color: "#ccc" }} />
        <span className="font-semibold text-white text-base tracking-wide">PagomóvilBDV</span>
        <Menu size={20} style={{ color: "#ccc" }} />
      </div>

      <div className="flex items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BTN_PURPLE }}>
            <PasteIcon />
          </div>
          <span className="text-white text-xs font-light">Pegar datos</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-light">Leer datos</span>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BTN_PURPLE }}>
            <QrIcon />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 flex-1 overflow-y-auto pb-4">
        <OutlinedSelect label="Operación:" value="Personas" open={false} onToggle={() => {}}>
          <></>
        </OutlinedSelect>

        <div className="flex gap-2.5 items-start">
          <div className="flex-1">
            <OutlinedInput
              label="Documento:"
              value={form.documento}
              onChange={(v) => setForm({ ...form, documento: v })}
              inputMode="numeric"
              maxLength={8}
            />
          </div>
          <button
            type="button"
            className="flex items-center justify-center rounded-xl flex-shrink-0 active:scale-95 transition-transform mt-0.5"
            style={{ background: BTN_PURPLE, width: 48, height: 48 }}
          >
            <PersonSearchIcon />
          </button>
        </div>

        <div ref={bankRef}>
          <OutlinedSelect
            label="Banco:"
            value={form.banco}
            open={bankOpen}
            onToggle={() => setBankOpen((o) => !o)}
          >
            {BANKS.map((b) => (
              <button
                type="button"
                key={b}
                className="w-full text-left px-4 py-3 text-xs font-light text-white hover:bg-white/10 transition-colors"
                style={{ borderBottom: "1px solid #444" }}
                onClick={() => {
                  setForm({ ...form, banco: b });
                  setBankOpen(false);
                }}
              >
                {b}
              </button>
            ))}
          </OutlinedSelect>
        </div>

        <OutlinedInput label="Teléfono:" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} inputMode="numeric" maxLength={11} />
        <OutlinedInput label="Monto:" value={form.monto} onChange={(v) => setForm({ ...form, monto: v })} inputMode="decimal" />
        <OutlinedInput label="Concepto:" value={form.concepto} onChange={(v) => setForm({ ...form, concepto: v })} />

        <div className="flex justify-center gap-5 mt-3">
          <button className="px-10 py-3 rounded-2xl text-white font-medium text-sm tracking-wide active:scale-95 transition-transform" style={{ background: BTN_PURPLE }} onClick={() => onPagar(form)}>
            Pagar
          </button>
          <button className="px-10 py-3 rounded-2xl text-white font-medium text-sm tracking-wide active:scale-95 transition-transform" style={{ background: BTN_PURPLE }} onClick={() => setForm({ documento: "", banco: "0102 - BANCO DE VENEZUELA", telefono: "", monto: "", concepto: "" })}>
            Limpiar
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 mt-3 mb-2">
          <LimitesIcon />
          <span className="text-xs tracking-wide" style={{ color: "#a855f7" }}>Límites de operaciones</span>
        </div>
      </div>

      {/* ═══ BARRA INFERIOR ═══ */}
      <div className="relative flex-shrink-0 w-full" style={{ background: NAV_BG }}>
        <img
          src={navBarImage}
          alt="Navegación"
          className="w-full"
          style={{ height: "auto", display: "block", maxHeight: 90 }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCREEN 2: COMPROBANTE (LABELS EN BLANCO, FONDO #212121)
   ═══════════════════════════════════════════════════════════ */
function Comprobante({ data, onBack }: { data: FormData & { operacion: string }; onBack: () => void }) {
  const montoFormatted = (() => {
    const n = parseFloat(data.monto || "0");
    return isNaN(n) ? "0,00" : n.toFixed(2).replace(".", ",");
  })();

  const rows = [
    { label: "Fecha:", value: formatDate(new Date()) },
    { label: "Operación:", value: data.operacion, copy: true },
    { label: "Identificación:", value: data.documento },
    { label: "Origen:", value: "0102****4255" },
    { label: "Destino:", value: data.telefono },
    { label: "Banco:", value: data.banco },
    { label: "Concepto:", value: data.concepto || "eme" },
  ];

  return (
    <div className="flex flex-col h-full select-none" style={{ background: "#212121" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <button onClick={onBack} className="active:scale-90 transition-transform">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <span className="font-medium text-white text-base tracking-wide">Comprobante de operación</span>
        <Share2 size={20} className="text-white opacity-90" />
      </div>

      {/* Logo + Check */}
      <div className="flex flex-col items-center gap-3 px-6 mt-2">
        <ImageWithFallback src={bdvLogo} alt="BDV logo" className="object-contain" style={{ width: 56, height: 56 }} />
        <span className="text-white font-light text-sm tracking-wide">PagomóvilBDV Personas</span>

        <div className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: "white" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L19 7" stroke="#212121" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Monto */}
        <div className="w-full flex items-center justify-center rounded-2xl py-3 mt-1" style={{ background: "#555555" }}>
          <span className="text-white font-normal text-lg tracking-wide">{montoFormatted} Bs</span>
        </div>
      </div>

      {/* Datos: LABELS EN BLANCO (no gris) */}
      <div className="flex flex-col px-6 mt-6 flex-1">
        {rows.map(({ label, value, copy }) => (
          <div key={label} className="flex items-center justify-between py-4 text-sm">
            <span className="text-white tracking-wide font-light">{label}</span>
            <div className="flex items-center gap-2">
              <span className="text-white text-right tracking-wide font-light">{value}</span>
              {copy && <Copy size={14} style={{ color: "#888888" }} />}
            </div>
          </div>
        ))}
      </div>

      {/* Botón volver */}
      <div className="flex justify-center py-6">
        <button onClick={onBack} className="p-2 active:scale-90 transition-transform">
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      {/* Toggle acceso directo */}
      <div className="flex items-center justify-center gap-3 py-4" style={{ borderTop: "1px solid #2a2a2a" }}>
        <div className="rounded-full relative" style={{ width: 40, height: 22, background: "#333333" }}>
          <div className="rounded-full absolute" style={{ width: 18, height: 18, background: "#777777", top: 2, left: 2 }} />
        </div>
        <span className="text-xs font-light tracking-wide" style={{ color: "#666666" }}>Crear Acceso directo</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState<"form" | "comprobante">("form");
  const [receipt, setReceipt] = useState<(FormData & { operacion: string }) | null>(null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative flex flex-col overflow-hidden shadow-2xl" style={{ width: 390, height: 844, maxHeight: "100dvh" }}>
        {screen === "form" ? (
          <PaymentForm onPagar={(d) => {
            const op = "00" + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
            setReceipt({ ...d, operacion: op });
            setScreen("comprobante");
          }} />
        ) : (
          <Comprobante data={receipt!} onBack={() => setScreen("form")} />
        )}
      </div>
    </div>
  );
}