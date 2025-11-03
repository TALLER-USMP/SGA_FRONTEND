import React, { createContext, useContext } from "react";

interface ReviewItem {
  status: "approved" | "rejected" | null;
  comment: string;
}

interface ReviewModeContextType {
  isReviewMode: boolean;
  onFieldReview?: (
    fieldId: string,
    status: "approved" | "rejected" | null,
  ) => void;
  onFieldComment?: (fieldId: string, comment: string) => void;
  reviewData?: Record<string, ReviewItem>;
}

const ReviewModeContext = createContext<ReviewModeContextType>({
  isReviewMode: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useReviewMode = () => useContext(ReviewModeContext);

interface ReviewModeProviderProps {
  children: React.ReactNode;
  isReviewMode?: boolean;
  onFieldReview?: (
    fieldId: string,
    status: "approved" | "rejected" | null,
  ) => void;
  onFieldComment?: (fieldId: string, comment: string) => void;
  reviewData?: Record<string, ReviewItem>;
}

export const ReviewModeProvider: React.FC<ReviewModeProviderProps> = ({
  children,
  isReviewMode = false,
  onFieldReview,
  onFieldComment,
  reviewData,
}) => {
  return (
    <ReviewModeContext.Provider
      value={{
        isReviewMode,
        onFieldReview,
        onFieldComment,
        reviewData,
      }}
    >
      {children}
    </ReviewModeContext.Provider>
  );
};
