import { 
    BadRequestException, 
    UnauthorizedException, 
    ForbiddenException, 
    NotFoundException, 
    ConflictException 
} from "./AppError";

export const appAssert = (
    condition: boolean,
    message: string,
    ErrorClass: new (msg: string) => Error = BadRequestException
): void => {
    if (!condition) {
        throw new ErrorClass(message);
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

        appAssert(isValid, `${label} is required`, BadRequestException);
    });
};

export const assertAuth = (
    condition: boolean,
    message: string = "Not authorized"
): void => {
    appAssert(condition, message, UnauthorizedException);
};

export const assertForbidden = (
    condition: boolean,
    message: string = "Forbidden"
): void => {
    appAssert(condition, message, ForbiddenException);
};

export function assertNotFound<T>(
    value: T,
    name: string
): asserts value is NonNullable<T> {
    appAssert(value != null, `${name} not found`, NotFoundException);
}

export const assertConflict = (
    condition: boolean,
    message: string = "Conflict"
): void => {
    appAssert(condition, message, ConflictException);
};

export function assertArray<T>(
    value: T,
    name: string = "Value"
): asserts value is Extract<T, unknown[]> {
    appAssert(
        Array.isArray(value),
        `${name} must be an array`,
        BadRequestException
    );
}
