import {BackendClient} from "./BackendClient";
import {GrafanaFunHeadersBuilder, GrafanaFunHeadersParams} from "../headers/GrafanaFunHeadersBuilder";


const BASE_URL = 'https://k6-http.grafana.fun';

export class GrafanaFunClient extends BackendClient<GrafanaFunHeadersBuilder, GrafanaFunHeadersParams> {
    getBaseUrl(): string {
        return BASE_URL
    }
    protected getHeadersBuilder(): GrafanaFunHeadersBuilder {
        return new GrafanaFunHeadersBuilder();
    }
}
