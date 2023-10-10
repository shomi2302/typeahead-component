const API_URL = 'http://localhost:8000';

export const get = async <T>(url: string): Promise<T[]> => {
    const response = await fetch(`${API_URL}/${url}`);
    return await response.json();
}

type DebounceFunction = (...args: any[]) => void;
export const debounce = (func: DebounceFunction, timeout: number = 300): DebounceFunction => {
    let timer: NodeJS.Timeout | undefined;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
};