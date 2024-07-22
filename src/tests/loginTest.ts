import {OptionsDefaults} from "../resources/setup/OptionsDefault";
import {LoginClient} from "../backend_requests/features/dummy/LoginClient";
import {UserDTO} from "../backend_requests/features/dummy/user-dto-model";

export let options = OptionsDefaults.OPTIONS_FUNCTIONAL;
const dummy = new LoginClient()

export default function () {
    let result = dummy.getToken().parseResponse<UserDTO>();
    dummy.getLogin(result.token);

}
