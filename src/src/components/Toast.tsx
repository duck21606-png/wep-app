import React from 'react';

interface ToastProps {
  message: string;
  subMessage?: string;
  isVisible: boolean;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  subMessage,
  isVisible,
  icon = 'check_circle',
}) => {
  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ease-out flex items-center gap-3 bg-[#283044] text-[#eef0ff] px-5 py-3.5 rounded-xl shadow-2xl pointer-events-none transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined text-[#6ffbbe] text-2xl shrink-0">
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold tracking-tight">{message}</span>
        {subMessage && (
          <span className="text-xs text-[#dae2fd]/80">{subMessage}</span>
        )}
      </div>
    </div>
  );
};
