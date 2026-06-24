import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown, ArrowLeft, Share2, Copy } from "lucide-react";
import bdvLogo from "@/imports/logo-bdv.png";
import navBarImage from "@/app/assets/nav-bar-bdv.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const BG_MAIN      = "#2a2a2a";
const FIELD_BG     = "#3a3a3a";
const BORDER_REST  = "#666666";
const BORDER_FOCUS = "#9333ea";
const BTN_PURPLE   = "#7e22ce";
const TEXT_MUTED   = "#b0b0b0";
const TEXT_WHITE   = "#ffffff";

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
          background: "transparent",
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
          color: TEXT_WHITE,
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

      <div className="relative flex-shrink-0" style={{ height: 70 }}>
        <img src={navBarImage} alt="Navegación" className="w-full h-full object-cover object-top" draggable={false} />
      </div>
    </div>
  );
}

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
    <div className="flex flex-col h-full select-none" style={{ background: BG_MAIN }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={onBack} className="active:scale-90 transition-transform">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <span className="font-normal text-white text-sm tracking-wide">Comprobante de operación</span>
        <Share2 size={20} className="text-white opacity-90" />
      </div>

      <div className="flex flex-col items-center gap-2 px-6 mt-1">
        <ImageWithFallback src={bdvLogo} alt="BDV logo" className="object-contain" style={{ width: 60, height: 60 }} />
        <span className="text-white font-light text-sm tracking-wide">PagomóvilBDV Personas</span>

        <div className="flex items-center justify-center rounded-full" style={{ width: 28, height: 28, background: "white" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L19 7" stroke="#222222" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="w-full flex items-center justify-center rounded-xl py-2.5 mt-1" style={{ background: "#555555" }}>
          <span className="text-white font-normal text-base tracking-wide">{montoFormatted} Bs</span>
        </div>
      </div>

      <div className="flex flex-col px-6 mt-5 flex-1 space-y-0.5">
        {rows.map(({ label, value, copy }) => (
          <div key={label} className="flex items-start justify-between py-2.5 text-xs font-light" style={{ borderBottom: "1px solid #3a3a3a" }}>
            <span className="text-gray-400 flex-shrink-0 mr-4 tracking-wide">{label}</span>
            <div className="flex items-center gap-1.5 flex-1 justify-end max-w-[65%]">
              <span className="text-white text-right break-words tracking-wide">{value}</span>
              {copy && <Copy size={13} style={{ color: "#888" }} />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center py-5">
        <button onClick={onBack} className="p-2.5 rounded-full" style={{ border: "1.5px solid #555" }}>
          <ArrowLeft size={22} className="text-white" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-3 py-3 border-t border-zinc-700/50">
        <div className="rounded-full relative" style={{ width: 36, height: 20, background: "#555", padding: 2 }}>
          <div className="rounded-full" style={{ width: 16, height: 16, background: "#999", position: "absolute", left: 2, top: 2 }} />
        </div>
        <span className="text-gray-400 text-xs font-light tracking-wide">Crear Acceso directo</span>
      </div>
    </div>
  );
}

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