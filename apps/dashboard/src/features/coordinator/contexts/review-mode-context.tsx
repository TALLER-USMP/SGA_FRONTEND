import React, { createContext, useContext } from "react";

interface ReviewModeContextType {
  isReviewMode: boolean;
  onFieldReview?: (
    fieldId: string,
    status: "approved" | "rejected" | null,
  ) => void;
  onFieldComment?: (fieldId: string, comment: string) => void;
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
}

export const ReviewModeProvider: React.FC<ReviewModeProviderProps> = ({
  children,
  isReviewMode = false,
  onFieldReview,
  onFieldComment,
}) => {
  return (
    <ReviewModeContext.Provider
      value={{
        isReviewMode,
        onFieldReview,
        onFieldComment,
      }}
    >
      {children}
    </ReviewModeContext.Provider>
  );
};
