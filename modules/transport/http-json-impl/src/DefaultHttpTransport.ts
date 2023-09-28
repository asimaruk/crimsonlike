import { HttpTransport } from 'transport-http-api';

export class DefaultHttpTransport implements HttpTransport {

    private queue: Promise<void> = Promise.resolve();
    private currentRequest: XMLHttpRequest | null = null;

    constructor(
        private protocol: 'http' | 'https',
        private host: string,
        private port: number,
    ) {}

    get<T>(apiMethod: string): Promise<T> {
        return this.sendRequest('GET', apiMethod, (url: string, xhr: XMLHttpRequest) => {
            this.xhrGet(url, xhr);
        });
    }

    post<T>(apiMethod: string, data?: any): Promise<T> {
        return this.sendRequest('POST', apiMethod, (url: string, xhr: XMLHttpRequest) => {
            this.xhrPost(url, xhr, data);
        });
    }

    serialize(data: Object): string {
        return JSON.stringify(data);
    }

    deserialize(str: string): Object {
        return JSON.parse(str);
    }

    reset() {
        this.currentRequest?.abort();
        this.queue = Promise.resolve();
    }

    private sendRequest<T>(
        httpMethod: 'POST' | 'GET',
        apiMethod: string,
        send: (url: string, xhr: XMLHttpRequest) => void,
    ): Promise<T> {
        const xhr = new XMLHttpRequest();
        const url = `${this.protocol}://${this.host}:${this.port}/${apiMethod}`
        const result = new Promise<T>((resolve, reject) => {
            this.currentRequest = xhr;
            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status >= 200 && xhr.status < 400) {
                    const response = xhr.responseText;
                    console.log(`<-- ${httpMethod} ${xhr.responseURL} ${response}`);
                    try {
                        const responseObject = this.deserialize(response);
                        resolve(responseObject as T);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(`status: ${xhr.status}, ${xhr.statusText}`);
                }
            };
        });
        this.queue = this.queue.then(() => send(url, xhr));
        return result;
    }

    private xhrPost(url: string, xhr: XMLHttpRequest, data: Object) {
        const strData = this.serialize(data);
        console.log(`--> POST ${url} ${strData}`);
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(strData);
    }

    private xhrGet(url: string, xhr: XMLHttpRequest) {
        console.log(`--> GET ${url}`);
        xhr.open('GET', url);
        xhr.send();
    }
}