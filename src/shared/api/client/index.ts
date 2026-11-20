import { getAccessToken } from '@/shared/auth';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type Query = Record<string, string | number | undefined>;

export interface ApiErrorDetail {
    path: string;
    message: string;
}

export interface ApiResponse<TData, TMeta = {}> {
    data: TData;
    meta: TMeta & { requestId: string };
}

export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly code: string,
        message: string,
        readonly details: ApiErrorDetail[] = [],
    ) {
        super(message);
    }
}

const toUrl = (path: string, query: Query = {}) => {
    const url = new URL(path, import.meta.env.VITE_API_URL);

    Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.set(key, String(value));
        }
    });

    return url;
};

const parseBody = async (response: Response): Promise<unknown> => {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

const toApiError = (status: number, body: unknown) => {
    if (body && typeof body === 'object' && 'error' in body) {
        const { code, message, details } = body.error as { code: string, message: string, details?: ApiErrorDetail[] };

        return new ApiError(status, code, message, details);
    }

    if (body && typeof body === 'object' && 'message' in body) {
        return new ApiError(status, 'GATEWAY', String(body.message));
    }

    return new ApiError(status, 'UNKNOWN', `Request failed with status ${status}`);
};

export const sendRequest = async <TData, TMeta = {}>(path: string, options: {
    method?: Method,
    body?: unknown,
    query?: Query,
} = {}) => {
    const { method = 'GET', body, query } = options;

    const jwt = await getAccessToken();

    const headers: HeadersInit = {
        Authorization: `Bearer ${jwt}`,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    };

    const response = await fetch(toUrl(path, query), {
        method,
        headers,
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    const result = await parseBody(response);

    if (!response.ok) {
        throw toApiError(response.status, result);
    }

    return result as ApiResponse<TData, TMeta>;
};

export const getErrorMessage = (error: unknown) => {
    if (error instanceof ApiError) {
        const [detail] = error.details;

        return detail ? `${error.message}: ${detail.path} ${detail.message}` : error.message;
    }

    return error instanceof Error ? error.message : 'Unknown error';
};
