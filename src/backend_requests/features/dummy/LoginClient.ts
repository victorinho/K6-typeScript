import {DummyJsonClient} from "../../clients/DummyJsonClient";

export class LoginClient {
    dummyClient: DummyJsonClient =  new DummyJsonClient();
    GET_PATH: string = `/auth/login`;
    LOGIN_PATH: string = '/auth/me';


    getToken() {
        let body = {
            username: 'emilys',
            password: 'emilyspass',
        }
        return this.dummyClient.post(this.GET_PATH, undefined, {body:body});
    }

    getLogin(token:string){
        return this.dummyClient.get(this.LOGIN_PATH,{ authToken: token })
    }

}
