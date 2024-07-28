import {GrafanaFunClient} from "../clients/grafana-fun-client";

export class HttpMethodsClient {
    httpMethods: GrafanaFunClient = new GrafanaFunClient();
    GET_PATH: string = `/get`;
    getToken() {
        return this.httpMethods.get(this.GET_PATH, undefined, undefined);
    }

}
