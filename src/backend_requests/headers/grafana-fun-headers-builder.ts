import {IHeadersBuilder, IHeadersParam} from "./i-headers-builder";

export class GrafanaFunHeadersBuilder implements IHeadersBuilder<GrafanaFunHeadersParams>{
    build(): Record<string, string> {
        return {
               };
    }
}

export interface GrafanaFunHeadersParams extends IHeadersParam {
}
