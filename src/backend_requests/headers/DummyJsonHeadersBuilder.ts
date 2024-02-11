import {IHeadersBuilder, IHeadersParam} from "./IHeadersBuilder";

const headers: Record<string, string> = {
    'Content-Type': 'application/json'
};;
export class DummyJsonHeadersBuider implements IHeadersBuilder<DummyJsonHeadersParams>{
    build(params: DummyJsonHeadersParams | undefined): Record<string, string> {
        if (params === undefined) {
            return headers;
        }
        if (params.authToken !== undefined) {
            if (typeof params.authToken === 'string') {
                headers['Authorization'] = `Bearer ${params.authToken}`;
            }
            
        }
        return headers;
    }
}

export interface DummyJsonHeadersParams extends IHeadersParam {
    authToken?: string | null;
}
