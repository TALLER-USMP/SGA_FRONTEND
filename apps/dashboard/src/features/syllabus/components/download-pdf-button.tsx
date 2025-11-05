import { Download, Eye, Loader2 } from "lucide-react";
import { useSyllabusPDF } from "../hooks/use-syllabus-pdf";
import { toast } from "sonner";

interface DownloadPDFButtonProps {
  syllabusId: number;
  variant?: "primary" | "secondary" | "outline";
  showPreview?: boolean;
  className?: string;
}

export function DownloadPDFButton({
  syllabusId,
  variant = "primary",
  showPreview = false,
  className = "",
}: DownloadPDFButtonProps) {
  const { generatePDF, previewPDF, isGenerating, error } = useSyllabusPDF({
    onSuccess: () => {
      toast.success("PDF generado exitosamente", {
        description: "El archivo se ha descargado correctamente",
      });
    },
    onError: (err) => {
      toast.error("Error al generar PDF", {
        description: err.message,
      });
    },
  });

  const handleDownload = () => {
    generatePDF(syllabusId);
  };

  const handlePreview = () => {
    previewPDF(syllabusId);
  };

  const baseClasses =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700",
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (error) {
    console.error("Error en DownloadPDFButton:", error);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={buttonClasses}
        title="Descargar PDF del sílabo"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generando PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Descargar PDF</span>
          </>
        )}
      </button>

      {showPreview && (
        <button
          onClick={handlePreview}
          disabled={isGenerating}
          className={`${baseClasses} ${variantClasses.outline}`}
          title="Previsualizar PDF"
        >
          <Eye className="w-5 h-5" />
          <span>Vista previa</span>
        </button>
      )}
    </div>
  );
}
