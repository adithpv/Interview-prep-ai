import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error) && error.response) {
    if (error.response.data?.message) {
      return error.response.data.message;
    }
    if (error.response.data?.error?.message) {
      return error.response.data.error.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
};
