import { HttpTransport } from "transport-http-api";
import { DefaultHttpTransport } from "./DefaultHttpTransport";

let transport: HttpTransport | null = null;

export function getHttpTransport(
    protocol: 'http' | 'https' = 'http',
    host: string = 'localhost',
    port: number = 3000
): HttpTransport {
    if (transport == null) {
        transport = new DefaultHttpTransport(protocol, host, port);
    }
    return transport;
}