import {OptionsDefaults} from "../resources/setup/options-default";
import {HttpMethodsClient} from "../backend_requests/features/http-methods-client";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const httpMethods = new HttpMethodsClient();


export default function () {
    httpMethods.getToken();
}
