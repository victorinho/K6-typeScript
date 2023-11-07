import {IHeadersBuilder, IHeadersParam} from "./IHeadersBuilder";

export class GrafanaFunHeadersBuilder implements IHeadersBuilder<GrafanaFunHeadersParams>{
    build(): Record<string, string> {
        return {
               };
    }
}

export interface GrafanaFunHeadersParams extends IHeadersParam {
}
