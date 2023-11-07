import http, {RefinedResponse} from 'k6/http';
// @ts-ignore
import {FormData} from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import {IHeadersBuilder, IHeadersParam} from "../headers/IHeadersBuilder";
import {PathResolver} from "../utils/PathResolver";

export abstract class BackendClient<T extends IHeadersBuilder<P>, P extends IHeadersParam> {

    protected abstract getBaseUrl(): string

    protected abstract getHeadersBuilder(): T

    get(path: string, headersParam: P | undefined, {
        extraHeaders,
        queryParams,
        body,
        verbose = true
    }: BackendRequestParams = {verbose: true}): RefinedResponse<any> {
        let request = new BackendRequest(path, BackendRequestMethod.GET, body, extraHeaders, queryParams)
        return this.executeRequest(request, headersParam, verbose)
    }

    post(path: string, headersParam: P | undefined, {
        extraHeaders,
        queryParams,
        body,
        verbose = true
    }: BackendRequestParams = {verbose: true}): RefinedResponse<any> {
        let request = new BackendRequest(path, BackendRequestMethod.POST, body, extraHeaders, queryParams)
        return this.executeRequest(request, headersParam, verbose)
    }

    del(path: string, headersParam: P | undefined, {
        extraHeaders,
        queryParams,
        body,
        verbose = true
    }: BackendRequestParams = {verbose: true}): RefinedResponse<any> {
        let request = new BackendRequest(path, BackendRequestMethod.DELETE, body, extraHeaders, queryParams)
        return this.executeRequest(request, headersParam, verbose)
    }

    private executeRequest(request: BackendRequest, headersParam: P | undefined, verbose: boolean = true): RefinedResponse<any> {
        let headers = this.getHeadersBuilder().build(headersParam);
        headers["Accept"] = "application/json;charset=utf-8";
        if (request.method != BackendRequestMethod.GET && request.method != BackendRequestMethod.FORM) {
            headers["Content-Type"] = "application/json";
        }
        headers = Object.assign(headers, request.headers);
        switch (request.method) {
            case BackendRequestMethod.GET:
                return this.getInternal(request, headers, verbose)
            case BackendRequestMethod.POST:
                return this.postInternal(request, headers, verbose)
            case BackendRequestMethod.FORM:
                return this.formInternal(request, headers, verbose)
            case BackendRequestMethod.PUT:
                return this.putInternal(request, headers, verbose)
            case BackendRequestMethod.DELETE:
                return this.deleteInternal(request, headers, verbose)
            case BackendRequestMethod.PATCH:
            case BackendRequestMethod.OPTIONS:
            default:
                throw new Error(`${request.method} is not implemented`);
        }
    }

    private getInternal(request: BackendRequest, headers: Record<string, string>, verbose: boolean = true): RefinedResponse<any> {
        return this.execute(request, headers, verbose)
    }

    private postInternal(request: BackendRequest, headers: Record<string, string>, verbose: boolean = true): RefinedResponse<any> {
        return this.execute(request, headers, verbose)
    }

    private formInternal(request: BackendRequest, headers: Record<string, string>, verbose: boolean = true): RefinedResponse<any> {
        if (!(request.body instanceof FormData)) {
            throw new Error("Body should be a FormData to send a FORM method")
        }

        headers["Content-Type"] = `multipart/form-data; boundary=${request.body.boundary}`

        return this.execute(request, headers, verbose)
    }

    private putInternal(request: BackendRequest, headers: Record<string, string>, verbose: boolean = true): RefinedResponse<any> {
        headers["X-HTTP-Method-Override"] = "PUT"

        return this.execute(request, headers, verbose)
    }

    private deleteInternal(request: BackendRequest, headers: Record<string, string>, verbose: boolean = true): RefinedResponse<any> {
        headers["X-HTTP-Method-Override"] = "DELETE"

        return this.execute(request, headers, verbose)
    }

    private execute(request: BackendRequest, headers: Record<string, string>, verbose: boolean = true): RefinedResponse<any> {
        let method = BackendRequestMethod[request.method]
        let requestBody = request.body !== undefined ? JSON.stringify(request.body) : undefined
        let url = PathResolver.resolve(this.getBaseUrl(), request.path)
        url = PathResolver.resolveQueryParams(url, request.queryParams)

        let response = http.request(method, url.toString(), requestBody, {headers: headers})
        if (verbose) {
            console.log(`${method}-${url} with body ${requestBody}`)
            console.log(`Headers: ${JSON.stringify(headers)}`)
            console.log(`Body: ${response.body}`)
        }

        return response
    }
}

/**
 * Model containing all required data to execute a request to a backend
 */
export class BackendRequest {
    path: string
    method: BackendRequestMethod
    body: BackendBody
    headers: Record<string, string>
    queryParams: Record<string, string>

    constructor(path: string, method: BackendRequestMethod, body?: BackendBody, headers?: Record<string, string>,
                queryParams?: Record<string, string>) {
        this.path = path
        this.method = method
        this.body = body ?? {}
        this.headers = headers ?? {}
        this.queryParams = queryParams ?? {}
    }
}

export interface BackendRequestParams {
    extraHeaders?: Record<string, string>
    queryParams?: Record<string, string>
    body?: BackendBody
    verbose?: boolean
}

export type BackendBody = Record<string, string | number | boolean> | FormData

enum BackendRequestMethod {
    GET,
    POST,
    PUT,
    DELETE,
    FORM,
    PATCH,
    OPTIONS
}
