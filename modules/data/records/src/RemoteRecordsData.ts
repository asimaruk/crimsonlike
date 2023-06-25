import { RecordsData } from "records-data-api";

export class RemoteRecordsData implements RecordsData {

    private queue: Promise<void> = Promise.resolve();
    private currentRequest: XMLHttpRequest | null = null;

    constructor(
        private protocol: 'http' | 'https',
        private host: string,
        private port: number
    ) {}

    getRecords(): Promise<RecordsData.Record[]> {
        return this.sendRequest<RecordsData.Record[]>(`${this.protocol}://${this.host}:${this.port}/records`);
    }

    postRecord(record: RecordsData.Record): Promise<RecordsData.NewRecord> {
        return this.sendRequest<RecordsData.NewRecord>(`${this.protocol}://${this.host}:${this.port}/new_record`, record);
    }

    reset() {
        this.currentRequest?.abort();
    }

    private sendRequest<T>(url: string, data?: any): Promise<T> {
        const xhr = new XMLHttpRequest();
        const method = data ? 'POST' : 'GET';
        const result = new Promise<T>((resolve, reject) => {
            this.currentRequest = xhr;
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status >= 200 && xhr.status < 400) {
                    const response = xhr.responseText;
                    console.log(`<-- ${method} ${xhr.responseURL} ${response}`);
                    try {
                        const responseObject = JSON.parse(response);
                        resolve(responseObject as T);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(`status: ${xhr.status}, ${xhr.statusText}`);
                }
            };
        });
        this.queue = this.queue.then(async () => {
            if (data) {
                xhr.open('POST', url);
                xhr.setRequestHeader('Content-Type', 'application/json');
                const strData = JSON.stringify(data);
                xhr.send(strData);
                console.log(`--> POST ${url} ${strData}`);
            } else {
                xhr.open('GET', url);
                xhr.send();
                console.log(`--> GET ${url}`);
            }
            await result;
        });
        return result;
    }
}