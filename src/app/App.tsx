import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown, ArrowLeft, Share2, Copy } from "lucide-react";
import bdvLogo from "@/imports/logo-bdv.png";
import navBarImage from "@/app/assets/nav-bar-bdv.png";
import checkIcon from "@/app/assets/check-icon.png";
import bottomBarImage from "@/app/assets/bottom-bar-receipt.png";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* ═══════════════════════════════════════════════════════════
   PALETTE
   ═══════════════════════════════════════════════════════════ */
const BG_FORM = "#303030";
const BG_RECEIPT = "#212121";
const FIELD_BG = "#454545";
const BORDER_REST = "#9d9d9d";
const BORDER_FOCUS = "#622d87";
const BTN_PURPLE = "#622d87";
const NAV_BG = "#71277a";
const TEXT_MUTED = "#aaaaaa";

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

interface ReceiptData extends FormData {
  operacion: string;
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
          border: focused ? `2px solid ${BORDER_FOCUS}` : `2.5px solid ${BORDER_REST}`,
          padding: isActive ? "16px 16px 8px" : "12px 16px",
          fontSize: "0.95rem",
        }}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          let v = e.target.value;
          
          if (inputMode === "numeric") {
            v = v.replace(/\D/g, "");
          }
          
          if (inputMode === "decimal") {
            // Permitir números, puntos y comas
            v = v.replace(/[^0-9.,]/g, "");
            // Reemplazar la coma por punto para el manejo interno del estado
            v = v.replace(",", ".");
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
          border: open ? `2px solid ${BORDER_FOCUS}` : `2.5px solid ${BORDER_REST}`,
          padding: "20px 16px 8px",
        }}
      >
        <span
          className="absolute left-4 top-1 text-xs pointer-events-none"
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
      <rect x="16" y="6" width="22" height="36" rx="3" stroke="#622d87" strokeWidth="1.5" />
      <rect x="20" y="11" width="14" height="24" rx="1.5" stroke="#622d87" strokeWidth="1.2" />
      <circle cx="27" cy="23" r="6" stroke="#622d87" strokeWidth="1.3" />
      <line x1="27" y1="19" x2="27" y2="23" stroke="#622d87" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="23" x2="30" y2="23" stroke="#622d87" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="27" cy="38" r="1.5" stroke="#a855f7" strokeWidth="1.2" />
      <path d="M13 40 Q11 45 16 47 L38 47 Q43 47 44 43 Q45 40 42 38" stroke="#622d87" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <line x1="22" y1="42" x2="22" y2="47" stroke="#622d87" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="42" x2="27" y2="47" stroke="#622d87" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="32" y1="42" x2="32" y2="47" stroke="#622d87" strokeWidth="1.2" strokeLinecap="round" />
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const bankRef = useRef<HTMLDivElement>(null);

  /* Detecta teclado virtual vía Visual Viewport API */
  useEffect(() => {
    const onResize = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const ih = window.innerHeight;
      setKeyboardVisible(vh < ih - 100);
    };
    window.visualViewport?.addEventListener("resize", onResize);
    onResize();
    return () => window.visualViewport?.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (bankRef.current && !bankRef.current.contains(e.target as Node))
        setBankOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="flex flex-col h-full select-none" style={{ background: BG_FORM }}>
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
        <Bell size={20} style={{ color: "#ccc" }} />
        <span className="font-bold text-white text-lg tracking-wide" style={{ marginLeft: "-160px" }}>
          PagomóvilBDV
        </span>
        <Menu size={20} style={{ color: "#ccc" }} />
      </div>

      <div className="flex items-center px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BTN_PURPLE }}>
            <PasteIcon />
          </div>
          <span className="text-white text-xs font-bold">Pegar datos</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-bold">Leer datos</span>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BTN_PURPLE }}>
            <QrIcon />
          </div>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className={`flex flex-col gap-7 px-4 flex-1 overflow-y-auto ${keyboardVisible ? "pb-4" : "pb-24"}`}>
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

        <div className="flex justify-center gap-5 mt-0">
          <button className="px-6 py-3 rounded-2xl text-white font-bold text-sm tracking-wide active:scale-95 transition-transform" style={{ background: BTN_PURPLE }} onClick={() => onPagar(form)}>
            Pagar
          </button>
          <button className="px-4 py-3 rounded-2xl text-white font-bold text-sm tracking-wide active:scale-95 transition-transform" style={{ background: BTN_PURPLE }} onClick={() => setForm({ documento: "", banco: "0102 - BANCO DE VENEZUELA", telefono: "", monto: "", concepto: "" })}>
            Limpiar
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 mt-0 mb-2">
          <LimitesIcon />
          <span className="text-xs tracking-wide font-bold" style={{ color: "#622d87" }}>Límites de operaciones</span>
        </div>
      </div>

      {/* Barra inferior: se oculta por completo cuando el teclado está abierto en lugar de levantar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-50 ${keyboardVisible ? "hidden" : "block"}`}
        style={{ background: NAV_BG }}
      >
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
   SCREEN 2: COMPROBANTE (ALINEACION CORREGIDA)
   ═══════════════════════════════════════════════════════════ */
function Comprobante({ data, onBack }: { data: ReceiptData; onBack: () => void }) {
  const montoFormatted = (() => {
    const n = parseFloat(data.monto || "0");
    if (isNaN(n)) return "0,00";
    // Forzamos el separador de miles con punto y el decimal con coma
    const [intPart, decPart] = n.toFixed(2).split(".");
    return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + decPart;
  })();

  const rows = [
    { label: "Fecha:", value: formatDate(new Date()) },
    { label: "Operación:", value: data.operacion, copy: true },
    { label: "Identificación:", value: data.documento },
    { label: "Origen:", value: "0102****4255" },
    { label: "Destino:", value: data.telefono },
    { label: "Banco:", value: data.banco },
    { label: "Concepto:", value: data.concepto || "mmmm" },
  ];

  return (
    <div className="flex flex-col h-full select-none relative" style={{ background: BG_RECEIPT }}>
            {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-6">
        <button onClick={onBack} className="active:scale-90 transition-transform bg-transparent border-none">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <span className="font-bold text-white tracking-wide text-lg" style={{ marginLeft: "-60px" }}>Comprobante de operación</span>
        <Share2 size={20} className="text-white opacity-90" />
      </div>

      {/* Logo + Check */}
      <div className="flex flex-col items-center gap-2 px-6 pt-4 mt-1">
        <ImageWithFallback src={bdvLogo} alt="BDV logo" className="object-contain" style={{ width: 56, height: 56 }} />
        <span className="text-white font-semibold text-lg tracking-wide">PagomóvilBDV Personas</span>

        <img 
          src={checkIcon} 
          alt="Check" 
          style={{ width: 24, height: 24 }} 
          draggable={false}
        />

        <div className="w-full flex items-center justify-center rounded-lg py-2 mt-1" style={{ background: "#757575" }}>
          <span className="text-white font-semibold text-lg tracking-wide">{montoFormatted} Bs</span>
        </div>
      </div>

      {/* Datos: Ajustado el peso y tamaño de la fuente de 'text-s' a 'text-sm' y pesos a normal/medium para el match perfecto */}
      <div className="flex flex-col px-8 mt-2.5 flex-1 overflow-y-auto pb-24">
        {rows.map(({ label, value, copy }) => (
          <div key={label} className="flex items-start justify-between py-1.5 text-sm">
            <span className="text-[#cccccc] tracking-wide font-normal pt-0.5 text-sm">{label}</span>
            <div className="flex items-start gap-2 max-w-[80%]">
              <span className="text-white text-right tracking-wide leading-relaxed font-medium text-sm">{value}</span>
              {copy && (
                <Copy 
                  size={16} 
                  strokeWidth={2.5}
                  className="text-white flex-shrink-0 mt-0.5" 
                />
              )}
            </div>
          </div>
        ))}
      </div>

            {/* Botón volver */}
      <div className="flex justify-center py-5">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform bg-transparent border-none">
          <ArrowLeft size={24} className="text-white" />
        </button>
      </div>

      {/* Barra inferior */}
      <div className="w-full">
        <img
          src={bottomBarImage}
          alt="Acceso directo"
          className="w-full"
          style={{ height: "auto", display: "block" }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState<"form" | "comprobante">("form");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  return (
    // Agregado Roboto como fuente primaria en el contenedor root
    <div className="flex items-center justify-center min-h-screen bg-black" style={{ fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif" }}>
      <div 
        className="relative flex flex-col overflow-hidden shadow-2xl w-full" 
        style={{ 
          maxWidth: 430,
          height: "100dvh",
        }}
      >
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