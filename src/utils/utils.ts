import { StorageState } from "../types";

const API_URL = 'http://localhost:8000';

export const get = async <T>(url: string): Promise<T[]> => {
    const response = await fetch(`${API_URL}/${url}`);
    return await response.json();
}

export type LocalStorageTypes = {
    states: StorageState[];
  };
  
  export function getLocalStorageData<Key extends keyof LocalStorageTypes>(
    item: Key,
    fallbackValue: LocalStorageTypes[Key],
  ): LocalStorageTypes[Key] {
    const lsData = localStorage.getItem(item);
  
    return lsData ? (JSON.parse(lsData) as LocalStorageTypes[Key]) : fallbackValue;
  }
  
  export function setLocalStorageData<Key extends keyof LocalStorageTypes>(
    item: Key,
    value: LocalStorageTypes[Key],
  ): void {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(item, stringifiedValue);
  }