export interface HttpTransport {
    get<T>(apiMethod: string): Promise<T>;
    post<T>(apiMethod: string, data?: any): Promise<T>;
    serialize(data: Object): string;
    deserialize(str: string): Object;
    reset(): void;
}