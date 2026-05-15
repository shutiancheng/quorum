"use client";

import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md mx-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-primary)] shadow-xl animate-card-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
          <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <X className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          </button>
        </div>
        <div className="p-6 space-y-3">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--border-primary)] flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
