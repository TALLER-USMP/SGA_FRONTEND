/**
 * Componente de demostración del sistema de Toast
 * Este componente muestra ejemplos de todos los tipos de notificaciones
 *
 * Para usar este componente, impórtalo en cualquier página:
 * import ToastDemo from "../components/ToastDemo";
 * <ToastDemo />
 */

import { useToast } from "../hooks/useToast";

export default function ToastDemo() {
  const toast = useToast();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Sistema de Notificaciones Toast - Demo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Success Toast */}
        <button
          onClick={() =>
            toast.success(
              "¡Operación exitosa!",
              "Los datos se guardaron correctamente",
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          ✓ Mostrar Success
        </button>

        {/* Error Toast */}
        <button
          onClick={() =>
            toast.error(
              "Error al procesar",
              "No se pudo conectar con el servidor",
            )
          }
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          ✕ Mostrar Error
        </button>

        {/* Warning Toast */}
        <button
          onClick={() =>
            toast.warning(
              "Atención requerida",
              "Esta acción no se puede deshacer",
            )
          }
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          ⚠ Mostrar Warning
        </button>

        {/* Info Toast */}
        <button
          onClick={() =>
            toast.info(
              "Información importante",
              "Los cambios se aplicarán en 5 minutos",
            )
          }
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          ℹ Mostrar Info
        </button>

        {/* Toast sin mensaje */}
        <button
          onClick={() => toast.success("¡Guardado!")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Solo título
        </button>

        {/* Toast con duración personalizada */}
        <button
          onClick={() =>
            toast.info("Toast largo", "Este toast dura 10 segundos", 10000)
          }
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Duración 10s
        </button>

        {/* Múltiples toasts */}
        <button
          onClick={() => {
            toast.success("Primera notificación");
            setTimeout(() => toast.info("Segunda notificación"), 500);
            setTimeout(() => toast.warning("Tercera notificación"), 1000);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Múltiples toasts
        </button>

        {/* Toast de validación */}
        <button
          onClick={() => {
            toast.error(
              "Validación fallida",
              "Por favor completa todos los campos requeridos",
            );
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Error de validación
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          Cómo usar en tu componente:
        </h3>
        <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
          {`import { useToast } from "../contexts/ToastContext";

export default function MyComponent() {
  const toast = useToast();

  const handleSubmit = () => {
    toast.success("¡Éxito!", "Operación completada");
  };

  return <button onClick={handleSubmit}>Enviar</button>;
}`}
        </pre>
      </div>
    </div>
  );
}
