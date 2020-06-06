export interface RootObject<T> {
    offset: number;
    limit: number;
    endOfRecords: boolean;
    results: T;
}
