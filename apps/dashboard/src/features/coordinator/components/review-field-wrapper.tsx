import React from "react";
import { useReviewMode } from "../contexts/review-mode-context";
import { ReviewButtons } from "./review-buttons";

interface ReviewFieldWrapperProps {
  fieldId: string;
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const ReviewFieldWrapper: React.FC<ReviewFieldWrapperProps> = ({
  fieldId,
  children,
  className = "",
  orientation = "horizontal",
}) => {
  const { isReviewMode, onFieldReview, onFieldComment, reviewData } =
    useReviewMode();

  if (!isReviewMode) {
    return <>{children}</>;
  }

  // Obtener datos de revisión previos para este campo
  const fieldReviewData = reviewData?.[fieldId];
  const initialStatus = fieldReviewData?.status || null;
  const initialComment = fieldReviewData?.comment || "";

  if (orientation === "vertical") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex-1">{children}</div>
        <div className="flex justify-end">
          <ReviewButtons
            fieldId={fieldId}
            onStatusChange={onFieldReview}
            onCommentChange={onFieldComment}
            initialStatus={initialStatus}
            initialComment={initialComment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-4 ${className}`}>
      <div className="flex-1">{children}</div>
      <div className="flex items-end">
        <ReviewButtons
          fieldId={fieldId}
          onStatusChange={onFieldReview}
          onCommentChange={onFieldComment}
          initialStatus={initialStatus}
          initialComment={initialComment}
        />
      </div>
    </div>
  );
};
