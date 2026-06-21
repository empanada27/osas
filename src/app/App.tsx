import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Copy, QrCode, User, Calculator } from 'lucide-react';
import bncLogo from '../imports/image-7.png';

interface PaymentData {
  tipoDoc: string;
  cedula: string;
  codigoArea: string;
  telefono: string;
  monto: string;
  bancoDestino: string;
  nombreBeneficiario: string;
  concepto: string;
}

const bancos = [
  '-- Seleccione --',
  '0156 - 100% Banco',
  '0171 - Activo',
  '0172 - Bancamiga',
  '0114 - BanCaribe',
  '0168 - BanCrecer',
  '0134 - Banesco',
  '0177 - BANFANB',
  '0146 - BanGente',
  '0174 - BanPlus',
  '0175 - BDT',
  '0151 - BFC',
  '0191 - BNC',
  '0128 - Caroni',
  '0157 - Del Sur',
  '0115 - Exterior',
  '0601 - I.M.C.P.',
  '0105 - Mercantil',
  '0178 - N58 Banco Digital',
  '0138 - Plaza',
  '0108 - Provincial',
  '0169 - R4',
  '0137 - Sofitasa',
  '0163 - Tesoro',
  '0102 - Venezuela',
  '0104 - Venezolano'
];

const codigosArea = ['0412', '0422', '0414', '0424', '0416', '0426'];

export default function App() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [activeTab, setActiveTab] = useState<'directorio' | 'sinRegistrar'>('sinRegistrar');
  const [registrarDirectorio, setRegistrarDirectorio] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    tipoDoc: 'V',
    cedula: '',
    codigoArea: '0412',
    telefono: '',
    monto: '',
    bancoDestino: '-- Seleccione --',
    nombreBeneficiario: '',
    concepto: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentData.bancoDestino === '-- Seleccione --') {
      alert('Por favor seleccione un banco beneficiario');
      return;
    }
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    setPaymentData({
      tipoDoc: 'V',
      cedula: '',
      codigoArea: '0412',
      telefono: '',
      monto: '',
      bancoDestino: '-- Seleccione --',
      nombreBeneficiario: '',
      concepto: ''
    });
    setRegistrarDirectorio(false);
  };

  return (
    <div className="size-full bg-[#121212] flex items-center justify-center text-white">
      <div className="w-full max-w-md h-full bg-black flex flex-col shadow-xl relative">
        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Tabs */}
              <div className="bg-[#121212] flex border-b border-[#222]">
                <button
                  onClick={() => setActiveTab('directorio')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'directorio'
                      ? 'bg-[#0056d6] text-white'
                      : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  Desde Directorio
                </button>
                <button
                  onClick={() => setActiveTab('sinRegistrar')}
                  className={`flex-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'sinRegistrar'
                      ? 'bg-[#0056d6] text-white'
                      : 'bg-[#1a1a1a] text-gray-400'
                  }`}
                >
                  Sin Registrar
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto pb-24">
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  
                  {/* Selector Cuenta a debitar (Añadido según la interfaz oscura) */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Cuenta a debitar</label>
                    <select className="w-full px-4 py-3 border border-[#333] rounded-lg bg-[#121212] text-white appearance-none focus:outline-none focus:border-[#0056d6]">
                      <option>-- Seleccione --</option>
                      <option>Cta. Ahorro Naranja ***7443</option>
                    </select>
                  </div>

                  {/* Banco Beneficiario */}
                  <div className="space-y-1 relative">
                    <label className="text-xs text-gray-400">Banco Beneficiario</label>
                    <div className="relative">
                      <select
                        value={paymentData.bancoDestino}
                        onChange={(e) => setPaymentData({ ...paymentData, bancoDestino: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-[#333] rounded-lg bg-[#121212] text-white appearance-none focus:outline-none focus:border-[#0056d6]"
                        required
                      >
                        {bancos.map((banco) => (
                          <option key={banco} value={banco} className="bg-[#1a1a1a]">{banco}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <button type="button" className="w-8 h-8 rounded-full bg-[#0056d6] flex items-center justify-center">
                          <Copy className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="flex gap-2 relative items-end">
                    <div className="w-24">
                      <select
                        value={paymentData.codigoArea}
                        onChange={(e) => setPaymentData({ ...paymentData, codigoArea: e.target.value })}
                        className="w-full px-3 py-3 border border-[#333] rounded-lg bg-[#121212] text-white appearance-none focus:outline-none focus:border-[#0056d6]"
                      >
                        {codigosArea.map((codigo) => (
                          <option key={codigo} value={codigo} className="bg-[#1a1a1a]">{codigo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="tel"
                        value={paymentData.telefono}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                          setPaymentData({ ...paymentData, telefono: val });
                        }}
                        placeholder="Celular"
                        className="w-full px-4 py-3 pr-24 border border-[#333] rounded-lg bg-[#121212] text-white focus:outline-none focus:border-[#0056d6]"
                        required
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button type="button" className="w-8 h-8 rounded-md bg-[#0056d6] flex items-center justify-center">
                          <QrCode className="w-4 h-4 text-white" />
                        </button>
                        <button type="button" className="w-8 h-8 rounded-md bg-[#ff6b35] flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Cédula/RIF */}
                  <div className="flex gap-2">
                    <select
                      value={paymentData.tipoDoc}
                      onChange={(e) => setPaymentData({ ...paymentData, tipoDoc: e.target.value })}
                      className="w-20 px-3 py-3 border border-[#333] rounded-lg bg-[#121212] text-white appearance-none focus:outline-none focus:border-[#0056d6]"
                    >
                      <option className="bg-[#1a1a1a]">V</option>
                      <option className="bg-[#1a1a1a]">E</option>
                      <option className="bg-[#1a1a1a]">J</option>
                      <option className="bg-[#1a1a1a]">G</option>
                      <option className="bg-[#1a1a1a]">P</option>
                    </select>
                    <input
                      type="tel"
                      value={paymentData.cedula}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                        setPaymentData({ ...paymentData, cedula: val });
                      }}
                      placeholder="Cédula/RIF"
                      className="flex-1 px-4 py-3 border border-[#333] rounded-lg bg-[#121212] text-white focus:outline-none focus:border-[#0056d6]"
                      required
                    />
                  </div>

                  {/* Nombre del Beneficiario */}
                  <div>
                    <input
                      type="text"
                      value={paymentData.nombreBeneficiario}
                      onChange={(e) => setPaymentData({ ...paymentData, nombreBeneficiario: e.target.value })}
                      placeholder="Nombre del Beneficiario"
                      className="w-full px-4 py-3 border border-[#333] rounded-lg bg-[#121212] text-white focus:outline-none focus:border-[#0056d6]"
                    />
                  </div>

                  {/* Monto a pagar */}
                  <div className="relative">
                    <div className="flex">
                      <div className="px-4 py-3 border border-r-0 border-[#333] rounded-l-lg bg-[#1a1a1a] text-gray-300">
                        Bs.
                      </div>
                      <input
                        type="tel"
                        value={paymentData.monto}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d,]/g, '');
                          setPaymentData({ ...paymentData, monto: val });
                        }}
                        placeholder="Monto a pagar"
                        className="flex-1 px-4 py-3 pr-14 border border-[#333] rounded-r-lg bg-[#121212] text-white focus:outline-none focus:border-[#0056d6]"
                        required
                      />
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button type="button" className="w-8 h-8 rounded-full bg-[#0056d6] flex items-center justify-center">
                        <Calculator className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Checkbox Registrar */}
                  <div className="flex items-start gap-3 p-4 bg-[#121212] border border-[#222] rounded-lg">
                    <input
                      type="checkbox"
                      checked={registrarDirectorio}
                      onChange={(e) => setRegistrarDirectorio(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#333] bg-black accent-[#0056d6]"
                    />
                    <label className="text-sm text-gray-300">
                      ¿Desea registrar el beneficiario en el directorio?
                    </label>
                  </div>

                  {/* Concepto */}
                  <div>
                    <input
                      type="text"
                      value={paymentData.concepto}
                      onChange={(e) => setPaymentData({ ...paymentData, concepto: e.target.value })}
                      placeholder="Concepto (Opcional)"
                      className="w-full px-4 py-3 border border-[#333] rounded-lg bg-[#121212] text-white focus:outline-none focus:border-[#0056d6]"
                    />
                  </div>

                  {/* Info Box Actualizado con Comisión Mínima de Bs. 2,00 */}
                  <div className="border-l-4 border-[#0056d6] bg-[#121212] border border-y-[#222] border-r-[#222] p-4 rounded-r-lg space-y-2">
                    <div className="flex items-start gap-2 text-xs text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-[#0056d6] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">i</span>
                      </div>
                      <span>Monto máximo hacia personas naturales <span className="text-blue-500 font-semibold">Bs. 1.000.000</span></span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-[#0056d6] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">i</span>
                      </div>
                      {/* Aquí está el cambio exacto de la comisión mínima tal como se solicitó */}
                      <span>Comisión mínima <span className="font-semibold">Bs. 2,00</span> - máxima <span className="font-semibold">0,30%</span> del monto.</span>
                    </div>
                  </div>

                  {/* Botones Continuar y Cancelar */}
                  <div className="space-y-3 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-[#00a651] text-white py-4 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      Continuar
                    </motion.button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full bg-transparent text-white border border-[#333] py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <span className="text-lg">🚫</span> Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col bg-black text-white"
            >
              {/* Success Content */}
              <div className="flex-1 overflow-y-auto p-6 pb-24">
                <div className="space-y-6">
                  {/* Success Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#121212] border border-[#222] border-l-4 border-l-[#00a651] p-4 flex items-start gap-3 rounded-r-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00a651] flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200">Su pago móvil ha sido ejecutado exitosamente</p>
                    </div>
                  </motion.div>

                  {/* Detalles estilo Oscuro */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#121212] border border-[#222] rounded-lg p-6 space-y-4"
                  >
                    {/* Cuenta debitada */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Cuenta debitada:</div>
                      <div className="text-gray-200">
                        Cta. Ahorro Naranja <span className="font-semibold"><span className="text-orange-500">B</span><span className="text-blue-500">N</span><span className="text-green-600">C</span></span> ***7443
                      </div>
                    </div>

                    <div className="border-t border-[#222]"></div>

                    {/* Beneficiario */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Beneficiario:</div>
                      <div className="text-gray-200">
                        {paymentData.codigoArea}-{paymentData.telefono} {paymentData.nombreBeneficiario || 'No indicado'} {paymentData.tipoDoc}-{paymentData.cedula} - {paymentData.bancoDestino}
                      </div>
                    </div>

                    <div className="border-t border-[#222]"></div>

                    {/* Monto */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Monto:</div>
                      <div className="text-gray-200">Bs. {paymentData.monto || '70,00'}</div>
                    </div>

                    <div className="border-t border-[#222]"></div>

                    {/* Comisión (Actualizado a Bs. 2,00 para que coincida) */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Comisión:</div>
                      <div className="text-red-400">Bs. 2,00</div>
                    </div>

                    <div className="border-t border-[#222]"></div>

                    {/* Total Actualizado */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Total:</div>
                      <div className="text-lg font-bold text-white">
                        Bs. {(parseFloat((paymentData.monto || '70').replace(',', '.')) + 2.00).toFixed(2).replace('.', ',')}
                      </div>
                        </div>

                    <div className="border-t border-[#222]"></div>

                    {/* Referencia */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Referencia:</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                          800650516
                        </span>
                        <button className="text-gray-400 hover:text-white">
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-[#222]"></div>

                    {/* Código autorizador */}
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Código autorizador:</div>
                      <div className="text-[#00a651] font-semibold text-lg">
                        577158
                      </div>
                        </div>
                  </motion.div>

                  {/* Botón volver */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="w-full bg-[#0056d6] text-white py-4 rounded-lg font-semibold shadow-md"
                  >
                    Realizar otro pago
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#121212] border-t border-[#222] text-white w-full">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span className="text-[9px]">CUENTAS</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span className="text-[9px]">TARJETAS</span>
            </button>
            <div className="flex flex-col items-center -mt-5 z-10">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg p-1.5">
                <img src={bncLogo} alt="BNC" className="w-full h-full object-contain" />
              </div>
            </div>
            <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span className="text-[9px] font-bold">PAGOS</span>
              <div className="w-5 h-0.5 bg-white rounded-full mt-0.5"></div>
            </button>
            <button className="flex flex-col items-center gap-1 p-2 min-w-[60px] text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span className="text-[9px]">DIVISAS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}