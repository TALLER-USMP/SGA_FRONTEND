import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import type { Toast, ToastType } from "../../types/toast";
import "./toast.css";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onRemove,
}: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle className="text-green-600" size={24} />,
          titleColor: "text-green-900",
          messageColor: "text-green-700",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <XCircle className="text-red-600" size={24} />,
          titleColor: "text-red-900",
          messageColor: "text-red-700",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: <AlertCircle className="text-yellow-600" size={24} />,
          titleColor: "text-yellow-900",
          messageColor: "text-yellow-700",
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <Info className="text-blue-600" size={24} />,
          titleColor: "text-blue-900",
          messageColor: "text-blue-700",
        };
    }
  };

  const styles = getToastStyles(toast.type);

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 min-w-[320px] animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${styles.titleColor} text-sm`}>
            {toast.title}
          </h3>
          {toast.message && (
            <p className={`mt-1 text-sm ${styles.messageColor}`}>
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
