import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, AlertTriangle, X, Shield, User } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutConfirmOpen, setIsLogoutConfirmOpen, logout, userSession } = useApp();

  if (!isLogoutConfirmOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Konfirmasi Keluar (Logout)</h3>
          </div>
          <button
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900">Keluar dari Sesi Aplikasi?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anda sedang masuk sebagai:
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-800 mt-1">
              {userSession.role === 'admin' ? (
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <User className="w-3.5 h-3.5 text-cyan-600" />
              )}
              <span>{userSession.namaUser || 'Pengguna'}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Setelah keluar, Anda perlu memasukkan kredensial login kembali untuk mengakses data Buku Induk.
          </p>

          <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="py-2.5 px-3 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                setIsLogoutConfirmOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ya, Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
