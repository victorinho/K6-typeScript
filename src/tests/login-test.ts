import {OptionsDefaults} from "../resources/setup/options-default";
import {LoginClient} from "../backend_requests/features/dummy/login-client";
import {UserDTO} from "../backend_requests/features/dummy/user-dto-model";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const dummy = new LoginClient()

export default function () {
    let result = dummy.getToken().parseResponse<UserDTO>();
    dummy.getLogin(result.token);
}
