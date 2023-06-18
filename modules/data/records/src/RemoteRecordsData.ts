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
        let xhr = new XMLHttpRequest();
        const result = new Promise<T>((resolve, reject) => {
            this.currentRequest = xhr;
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    const response = xhr.responseText;
                    console.log(response);
                    try {
                        const responseObject = JSON.parse(response);
                        resolve(responseObject as T);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(`status: ${xhr.status}`);
                }
            };
        });
        this.queue = this.queue.then(async () => {
            xhr.open("GET", url, true);
            if (data) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
            console.log(`GET ${url}`);
            await result;
        });
        return result;
    }
}