export type TypeaheadOption = {
    id: number;
    name: string;
}

export type StorageState = {
    query: string;
    states: TypeaheadOption[];
}