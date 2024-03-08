import {OptionsDefaults} from "../resources/setup/OptionsDefault";
import {LoginClient} from "../backend_requests/features/dummy/LoginClient";
import {parseJson} from "../resources/commons/CommonResources";
import {checkStatus} from "../resources/assertions/common/statusAssertions";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const dummy = new LoginClient()

export default function () {
    let result = dummy.getToken();
    let login = dummy.getLogin(parseJson(result).token);
    checkStatus({status:200,response:login,petitionName:'login'})
}
