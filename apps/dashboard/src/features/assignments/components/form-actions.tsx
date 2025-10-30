interface FormActionsProps {
  onGoBack: () => void;
  onSubmit: () => void;
}

export default function FormActions({ onGoBack, onSubmit }: FormActionsProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <button
        onClick={onGoBack}
        className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
      >
        &lt; Atrás
      </button>
      <button
        onClick={onSubmit}
        className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
      >
        Enviar
      </button>
    </div>
  );
}
