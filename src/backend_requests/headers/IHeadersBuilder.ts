export interface IHeadersBuilder<T extends IHeadersParam> {

    build(params: T | undefined): Record<string, string>;
}

export interface IHeadersParam {
}