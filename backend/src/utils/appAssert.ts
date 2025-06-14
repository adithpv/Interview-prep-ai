import AppError from "./AppError";
import { HttpStatus } from "./httpStatus";

export const appAssert = (
  condition: boolean,
  message: string,
  statusCode: number = HttpStatus.BAD_REQUEST
): void => {
  if (!condition) {
    throw new AppError(message, statusCode);
  }
};

export const assertFieldsExist = (
  fields: Record<string, any | { value: any; label?: string }>
): void => {
  Object.entries(fields).forEach(([key, raw]) => {
    let value: any;
    let label: string;

    if (typeof raw === "object" && raw !== null && "value" in raw) {
      value = raw.value;
      label = raw.label ?? key;
    } else {
      value = raw;
      label = key;
    }

    const isValid =
      typeof value === "string" ? value.trim().length > 0 : value != null;

    appAssert(isValid, `${label} is required`, HttpStatus.BAD_REQUEST);
  });
};

export const assertAuth = (
  condition: boolean,
  message: string = "Not authorized"
): void => {
  appAssert(condition, message, HttpStatus.UNAUTHORIZED);
};

export const assertForbidden = (
  condition: boolean,
  message: string = "Forbidden"
): void => {
  appAssert(condition, message, HttpStatus.FORBIDDEN);
};

export function assertNotFound<T>(
  value: T,
  name: string
): asserts value is NonNullable<T> {
  appAssert(value != null, `${name} not found`, HttpStatus.NOT_FOUND);
}

export const assertConflict = (
  condition: boolean,
  message: string = "Conflict"
): void => {
  appAssert(condition, message, HttpStatus.CONFLICT);
};

export function assertArray<T>(
  value: T,
  name: string = "Value"
): asserts value is Extract<T, unknown[]> {
  appAssert(
    Array.isArray(value),
    `${name} must be an array`,
    HttpStatus.BAD_REQUEST
  );
}
