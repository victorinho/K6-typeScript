import {OptionsDefaults} from "../resources/setup/OptionsDefault";
import {LoginClient} from "../backend_requests/features/dummy/LoginClient";
import {parseJson} from "../resources/commons/CommonResources";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const dummy = new LoginClient()

export default function () {
    let result = dummy.getToken();
    console.log(parseJson(result).token)
    dummy.getLogin(parseJson(result).token);
}
