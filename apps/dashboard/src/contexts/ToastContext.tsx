import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Toast } from "../types/toast";
import ToastContainer from "../components/toast/ToastContainer";
import { ToastContext } from "./toast-context";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
    },
    [removeToast],
  );

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "success", title, message, duration });
    },
    [showToast],
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "error", title, message, duration });
    },
    [showToast],
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "warning", title, message, duration });
    },
    [showToast],
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: "info", title, message, duration });
    },
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
