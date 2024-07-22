import {OptionsDefaults} from "../resources/setup/OptionsDefault";
import {HttpMethodsClient} from "../backend_requests/features/HttpMethodsClient";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const httpMethods = new HttpMethodsClient();


export default function () {
    httpMethods.getToken();
}
