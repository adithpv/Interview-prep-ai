export const HttpStatus = {
    // 1xx: Informational

    /** 100: The server has received the request headers, and the client should proceed to send the request body. */
    CONTINUE: 100,

    /** 101: The requester has asked the server to switch protocols. */
    SWITCHING_PROTOCOLS: 101,

    // 2xx: Success

    /** 200: The request was successful. */
    OK: 200,

    /** 201: The request was successful and a resource was created. */
    CREATED: 201,

    /** 202: The request has been accepted for processing, but the processing is not complete. */
    ACCEPTED: 202,

    /** 204: The server successfully processed the request, but is not returning any content. */
    NO_CONTENT: 204,

    // 3xx: Redirection

    /** 301: The resource has been moved permanently to a new URI. */
    MOVED_PERMANENTLY: 301,

    /** 302: The resource has been found at a different URI. */
    FOUND: 302,

    /** 304: The resource has not been modified since the last request. */
    NOT_MODIFIED: 304,

    // 4xx: Client Error

    /** 400: The request was invalid or cannot be served. */
    BAD_REQUEST: 400,

    /** 401: Authentication is required and has failed or not been provided. */
    UNAUTHORIZED: 401,

    /** 403: The client does not have access rights to the content. */
    FORBIDDEN: 403,

    /** 404: The server can not find the requested resource. */
    NOT_FOUND: 404,

    /** 409: The request could not be completed due to a conflict. */
    CONFLICT: 409,

    /** 422: The request was well-formed but was unable to be followed due to semantic errors. */
    UNPROCESSABLE_ENTITY: 422,

    // 5xx: Server Error

    /** 500: A generic error message, given when no more specific message is suitable. */
    INTERNAL_SERVER_ERROR: 500,

    /** 501: The server does not support the functionality required to fulfill the request. */
    NOT_IMPLEMENTED: 501,

    /** 502: The server was acting as a gateway or proxy and received an invalid response from the upstream server. */
    BAD_GATEWAY: 502,

    /** 503: The server is not ready to handle the request. */
    SERVICE_UNAVAILABLE: 503,
} as const;
