import { getAccessToken } from '@/shared/auth';

export const sendRequest = async <TResult>(path: string, options?: {
    method: 'POST' | 'GET' | 'PUT',
    body?: BodyInit,
}) => {
    const jwt = await getAccessToken();

    const headers = {
        Authorization: `Bearer ${jwt}`,
    };

    const url = new URL(path, import.meta.env.VITE_API_URL);

    const response = await fetch(url, { headers, ...options });

    const result: TResult = await response.json();

    if (!response.ok) {
        throw Error('Request Error', { cause: result });
    }

    return result;
}
