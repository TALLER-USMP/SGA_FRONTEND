interface FormActionsProps {
  onGoBack: () => void;
  onSubmit: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export default function FormActions({
  onGoBack,
  onSubmit,
  isDisabled = false,
  isLoading = false,
}: FormActionsProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <button
        onClick={onGoBack}
        disabled={isLoading}
        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &lt; Atrás
      </button>
      <button
        onClick={onSubmit}
        disabled={isDisabled || isLoading}
        className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Procesando...
          </span>
        ) : (
          "Enviar"
        )}
      </button>
    </div>
  );
}
