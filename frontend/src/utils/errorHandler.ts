import { isAxiosError } from "axios";
import { goeyToast, type GooeyToastOptions } from "goey-toast";

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

const defaults: GooeyToastOptions = { showTimestamp: false };

export const toast = {
  success: (title: string, opts?: GooeyToastOptions) =>
    goeyToast.success(title, { ...defaults, ...opts }),
  error: (title: string, opts?: GooeyToastOptions) =>
    goeyToast.error(title, { ...defaults, ...opts }),
  warning: (title: string, opts?: GooeyToastOptions) =>
    goeyToast.warning(title, { ...defaults, ...opts }),
  info: (title: string, opts?: GooeyToastOptions) =>
    goeyToast.info(title, { ...defaults, ...opts }),
};
