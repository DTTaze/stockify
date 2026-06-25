import { AlertTriangle, X } from "lucide-react";
import React, { useEffect } from "react";

import { ButtonCustom } from "@/components/common/form/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Khóa tài khoản",
  cancelText = "Hủy",
  isLoading = false,
}: ConfirmModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="border-border bg-card text-card-foreground w-full max-w-md scale-100 transform overflow-hidden rounded-xl border p-6 shadow-xl transition-all"
      >
        {/* Header with Icon and Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg leading-6 font-semibold text-neutral-900 dark:text-neutral-50">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message */}
        <div className="mt-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end space-x-3">
          <ButtonCustom
            onClick={onClose}
            variant="outline"
            height="h-9"
            className="border-border bg-background hover:bg-muted text-foreground cursor-pointer"
          >
            {cancelText}
          </ButtonCustom>
          <ButtonCustom
            onClick={onConfirm}
            loading={isLoading}
            variant="destructive"
            height="h-9"
            className="cursor-pointer"
          >
            {confirmText}
          </ButtonCustom>
        </div>
      </div>
    </div>
  );
}
