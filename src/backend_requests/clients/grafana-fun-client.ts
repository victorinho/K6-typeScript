import {BackendClient} from "./backend-client";
import {GrafanaFunHeadersBuilder, GrafanaFunHeadersParams} from "headers/grafana-fun-headers-builder";

const BASE_URL = 'https://k6-http.grafana.fun';

export class GrafanaFunClient extends BackendClient<GrafanaFunHeadersBuilder, GrafanaFunHeadersParams> {
    getBaseUrl(): string {
        return BASE_URL
    }
    protected getHeadersBuilder(): GrafanaFunHeadersBuilder {
        return new GrafanaFunHeadersBuilder();
    }
}
