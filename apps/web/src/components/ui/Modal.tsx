import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded-xl shadow-lg max-w-sm w-full p-6 relative animate-fade-in">
        {title && <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>}
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-4 text-center">{children}</div>
        {actions && <div className="flex gap-3 justify-center">{actions}</div>}
      </div>
    </div>
  );
}
