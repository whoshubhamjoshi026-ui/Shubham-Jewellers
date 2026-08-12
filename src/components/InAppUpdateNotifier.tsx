import React from 'react';
import { AppVersionInfo } from '../types';
import { Sparkles, RefreshCw, X } from 'lucide-react';

interface InAppUpdateNotifierProps {
  versionInfo: AppVersionInfo;
  onDismiss: () => void;
  onUpdateNow: () => void;
}

export const InAppUpdateNotifier: React.FC<InAppUpdateNotifierProps> = ({
  versionInfo,
  onDismiss,
  onUpdateNow,
}) => {
  if (!versionInfo.updateAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-bounce-short">
      <div className="bg-gradient-to-r from-[#4A0E17] via-[#6B1423] to-[#4A0E17] text-white p-4 rounded-2xl border-2 border-[#D4AF37] shadow-2xl relative flex items-start space-x-3">
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-amber-300 hover:text-white p-1 text-xs"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center shrink-0 text-[#D4AF37] mt-0.5">
          <Sparkles className="w-5 h-5 animate-spin-slow" />
        </div>

        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold bg-[#D4AF37] text-[#4A0E17] px-2 py-0.5 rounded">
              NEW VERSION v{versionInfo.latestVersion}
            </span>
          </div>

          <p className="text-xs font-bold text-[#D4AF37] mt-1">
            {versionInfo.updateMessage}
          </p>

          <p className="text-[11px] text-amber-100/90 font-light mt-0.5 leading-snug">
            A new version of Shubham Jewellers is available. Update now for live rate alerts & festive collections!
          </p>

          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={onUpdateNow}
              className="py-1.5 px-4 bg-[#D4AF37] text-[#4A0E17] font-bold text-xs rounded-xl hover:bg-amber-400 shadow transition-transform transform hover:scale-105 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Now</span>
            </button>
            <button
              onClick={onDismiss}
              className="py-1.5 px-3 bg-white/10 text-amber-200 text-xs font-semibold rounded-xl hover:bg-white/20"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
