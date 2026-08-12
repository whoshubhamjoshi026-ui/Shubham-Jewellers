import React from 'react';
import { Download, Sparkles, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { AppVersionInfo } from '../types';

interface AppUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  versionInfo: AppVersionInfo;
  darkMode: boolean;
  onConfirmUpdate: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  onClose,
  versionInfo,
  darkMode,
  onConfirmUpdate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className={`relative max-w-md w-full rounded-2xl border overflow-hidden shadow-2xl ${
          darkMode
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-[#FAF7F2] border-amber-200 text-amber-950'
        }`}
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] p-5 text-[#D4AF37] relative flex items-center space-x-3">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-[#D4AF37] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-[#D4AF37] animate-bounce" />
          </div>

          <div>
            <span className="text-[10px] font-extrabold tracking-widest uppercase bg-[#D4AF37] text-[#4A0E17] px-2 py-0.5 rounded-full">
              New Update Available
            </span>
            <h3 className="text-base font-extrabold font-serif tracking-tight mt-1 text-[#D4AF37]">
              Shubham Jewellers v{versionInfo.latestVersion}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-amber-900/90 dark:text-zinc-300 leading-relaxed font-medium">
            {versionInfo.updateMessage || 'A new update for Shubham Jewellers is now available! Enjoy enhanced security, live rate alerts, and smooth performance.'}
          </p>

          {versionInfo.releaseNotes && versionInfo.releaseNotes.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-zinc-800 border border-amber-200/80 dark:border-zinc-700 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                What's New in v{versionInfo.latestVersion}:
              </span>
              <ul className="space-y-1.5 text-xs">
                {versionInfo.releaseNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-amber-950 dark:text-zinc-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-amber-300 dark:border-zinc-700 text-amber-900 dark:text-zinc-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Remind Me Later
            </button>
            <button
              onClick={onConfirmUpdate}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#4A0E17] hover:bg-[#6B1423] text-[#D4AF37] font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Update Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
