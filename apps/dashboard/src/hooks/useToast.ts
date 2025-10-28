import { useContext } from "react";
import { ToastContext } from "../contexts/toast-context";

/**
 * Hook para usar el sistema de notificaciones Toast
 *
 * @example
 * const toast = useToast();
 * toast.success("¡Éxito!", "Operación completada");
 * toast.error("Error", "Algo salió mal");
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
