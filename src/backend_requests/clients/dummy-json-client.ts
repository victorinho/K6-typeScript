import {BackendClient} from "./backend-client";
import {DummyJsonHeadersBuider, DummyJsonHeadersParams} from "headers/dummy-json-headers-builder";


const BASE_URL = 'https://dummyjson.com';

export class DummyJsonClient extends BackendClient<DummyJsonHeadersBuider, DummyJsonHeadersParams> {
    getBaseUrl(): string {
        return BASE_URL
    }
    protected getHeadersBuilder(): DummyJsonHeadersBuider {
        return new DummyJsonHeadersBuider();
    }
}
