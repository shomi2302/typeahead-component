const API_URL = 'http://localhost:8000';

export const get = async <T>(url: string): Promise<T[]> => {
    const response = await fetch(`${API_URL}/${url}`);
    return await response.json();
}
