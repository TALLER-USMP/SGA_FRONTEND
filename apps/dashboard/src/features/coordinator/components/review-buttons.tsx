import { useState, useEffect } from "react";
import { Check, X, MessageSquare } from "lucide-react";

interface ReviewButtonsProps {
  fieldId: string;
  onStatusChange?: (
    fieldId: string,
    status: "approved" | "rejected" | null,
  ) => void;
  onCommentChange?: (fieldId: string, comment: string) => void;
  initialStatus?: "approved" | "rejected" | null;
  initialComment?: string;
}

export function ReviewButtons({
  fieldId,
  onStatusChange,
  onCommentChange,
  initialStatus = null,
  initialComment = "",
}: ReviewButtonsProps) {
  const [status, setStatus] = useState<"approved" | "rejected" | null>(
    initialStatus,
  );
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState(initialComment);

  // Sincronizar con initialStatus e initialComment cuando cambien
  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setComment(initialComment);
    if (initialComment && initialComment.trim() !== "") {
      setShowCommentBox(true);
    }
  }, [initialComment]);

  const handleApprove = () => {
    const newStatus = status === "approved" ? null : "approved";
    setStatus(newStatus);
    onStatusChange?.(fieldId, newStatus);
  };

  const handleReject = () => {
    const newStatus = status === "rejected" ? null : "rejected";
    setStatus(newStatus);
    onStatusChange?.(fieldId, newStatus);
  };

  const handleToggleComment = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    onCommentChange?.(fieldId, newComment);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Botón Aprobar */}
        <button
          data-review-button="true"
          onClick={handleApprove}
          className={`p-2 rounded-lg transition-all ${
            status === "approved"
              ? "bg-green-500 text-white shadow-md"
              : "bg-white text-green-500 border border-green-500 hover:bg-green-50"
          }`}
          title="Aprobar"
        >
          <Check size={16} />
        </button>

        {/* Botón Rechazar */}
        <button
          data-review-button="true"
          onClick={handleReject}
          className={`p-2 rounded-lg transition-all ${
            status === "rejected"
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-red-500 border border-red-500 hover:bg-red-50"
          }`}
          title="Rechazar"
        >
          <X size={16} />
        </button>

        {/* Botón Comentario */}
        <button
          data-review-button="true"
          onClick={handleToggleComment}
          className={`p-2 rounded-lg transition-all relative ${
            showCommentBox || comment
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50"
          }`}
          title="Agregar comentario"
        >
          <MessageSquare size={16} />
        </button>
      </div>

      {/* Caja de comentario flotante estilo GitHub */}
      {showCommentBox && (
        <div className="absolute top-full right-0 mt-2 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">
              Comentario
            </span>
            <button
              data-review-button="true"
              onClick={handleToggleComment}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          <textarea
            data-review-comment="true"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Escribe un comentario..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-900"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
