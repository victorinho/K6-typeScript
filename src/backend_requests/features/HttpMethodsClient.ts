import {GrafanaFunClient} from "../clients/GrafanaFunClient";

export class HttpMethodsClient {
    httpMethods: GrafanaFunClient = new GrafanaFunClient();
    GET_PATH: string = `/get`;
    getToken() {
        return this.httpMethods.get(this.GET_PATH, undefined, undefined);
    }

}
