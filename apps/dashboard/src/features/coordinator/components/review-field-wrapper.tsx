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
  const { isReviewMode, onFieldReview, onFieldComment } = useReviewMode();

  if (!isReviewMode) {
    return <>{children}</>;
  }

  if (orientation === "vertical") {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex-1">{children}</div>
        <div className="flex justify-end">
          <ReviewButtons
            fieldId={fieldId}
            onStatusChange={onFieldReview}
            onCommentChange={onFieldComment}
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
        />
      </div>
    </div>
  );
};
