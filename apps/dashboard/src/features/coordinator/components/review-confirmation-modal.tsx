interface ReviewConfirmationModalProps {
  isOpen: boolean;
  type: "approved" | "rejected";
  onClose: () => void;
}

export function ReviewConfirmationModal({
  isOpen,
  type,
  onClose,
}: ReviewConfirmationModalProps) {
  if (!isOpen) return null;

  const isApproved = type === "approved";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-3 text-gray-900">
          Revisión de sílabo exitosa
        </h2>

        {/* Estado Badge */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-lg font-medium text-gray-700">Estado -</span>
          <span
            className={`px-6 py-2 rounded-full font-semibold text-white text-base ${
              isApproved ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {isApproved ? "Aprobado" : "Desaprobado"}
          </span>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-base"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
