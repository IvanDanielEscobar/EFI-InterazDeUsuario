import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Gift, ShoppingBag, Ticket, Copy, Check, MapPin, Sparkles } from 'lucide-react';
import { PARTNER_STORES } from '../data/initialReports';

export default function PointsModal() {
  const { activeModal, setActiveModal, user, redeemPoints, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'coupons'
  const [copiedCode, setCopiedCode] = useState(null);

  if (activeModal !== 'points') return null;

  const handleCopyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Código ${code} copiado al portapapeles`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const myCoupons = user.myCoupons || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="points-modal-title"
    >
      <div className="w-full max-w-lg bg-slate-900 text-white rounded-3xl border border-slate-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Encabezado */}
        <header className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 id="points-modal-title" className="text-lg sm:text-xl font-bold text-white tracking-wide">
                Canjea tus Puntos
              </h2>
              <p className="text-xs text-slate-400">
                Beneficios en comercios de Río Cuarto
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            aria-label="Cerrar ventana de puntos"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Saldo de Puntos */}
        <div className="p-4 bg-linear-to-r from-slate-800 via-slate-850 to-slate-800 border-b border-slate-800 shrink-0 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tu Saldo Disponible:
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-2xl font-black text-amber-400 tracking-tight">{user.points}</span>
              <span className="text-xs text-amber-300/80 font-bold">puntos acumulados</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Rango actual:</span>
            <span className="text-xs font-black uppercase text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
              {user.tier}
            </span>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-800 bg-slate-900 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('stores')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'stores'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Comercios Adheridos ({PARTNER_STORES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === 'coupons'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Mis Cupones ({myCoupons.length})</span>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'stores' ? (
            <>
              <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                Canjea tus puntos por descuentos inmediatos en comercios de Río Cuarto presentando el cupón generado:
              </p>

              <div className="space-y-3">
                {PARTNER_STORES.map((store) => {
                  const canAfford = user.points >= store.pointsCost;
                  return (
                    <article
                      key={store.id}
                      className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white truncate">{store.name}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0">
                            {store.discount}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{store.category}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{store.address}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => redeemPoints(store.pointsCost, store.name, store.discount)}
                        disabled={!canAfford}
                        className={`btn-interactive px-3 py-2 rounded-xl font-bold text-xs shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
                          canAfford
                            ? 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 shadow-sm'
                            : 'bg-slate-750 text-slate-500 cursor-not-allowed border border-slate-700'
                        }`}
                      >
                        Canjear ({store.pointsCost} pts)
                      </button>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {myCoupons.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-slate-500">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">Aún no tienes cupones canjeados</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Visita la pestaña "Comercios Adheridos" para canjear tus puntos acumulados por descuentos en Río Cuarto.
                  </p>
                </div>
              ) : (
                myCoupons.map((coupon) => (
                  <article
                    key={coupon.id}
                    className="p-4 rounded-2xl bg-linear-to-br from-slate-800 to-slate-850 border border-amber-400/30 flex flex-col gap-2.5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{coupon.store}</h4>
                        <span className="text-xs font-bold text-amber-400">{coupon.discount}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{coupon.expires || 'Válido por 30 días'}</span>
                    </div>

                    <div className="bg-slate-900/90 border border-dashed border-amber-400/50 p-2.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Código de Canje:</span>
                        <code className="text-sm font-mono font-black text-amber-300 tracking-wider">
                          {coupon.code}
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        className="btn-interactive flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all focus-visible:outline-none"
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Emitido el: {coupon.date || 'Reciente'} • Presentar en mostrador del comercio.
                    </p>
                  </article>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pie */}
        <footer className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            {activeTab === 'stores' ? `${PARTNER_STORES.length} comercios disponibles` : `${myCoupons.length} cupones activos`}
          </span>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="btn-interactive px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
