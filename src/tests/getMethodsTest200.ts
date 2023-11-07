import {OptionsDefaults} from "../resources/setup/OptionsDefault";
import {checkStatus} from "../resources/assertions/common/statusAssertions";
import {HttpMethodsClient} from "../backend_requests/features/HttpMethodsClient";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const httpMethods = new HttpMethodsClient();


export default function () {
    let result = httpMethods.getToken();
    checkStatus({response: result, petitionName: "result", status: 200});
}
