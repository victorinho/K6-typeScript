import http, { RefinedResponse } from 'k6/http';
// @ts-ignore
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';
import { IHeadersBuilder, IHeadersParam } from 'headers/i-headers-builder';
import { PathResolver } from 'utils/path-resolver';
import { checkStatus, responseStatus } from 'assertions/common/status-assertions';

export abstract class BackendClient<T extends IHeadersBuilder<P>, P extends IHeadersParam> {
    protected abstract getBaseUrl(): string;

    protected abstract getHeadersBuilder(): T;

    responseMapper: BackendResponseMapper = new BackendResponseMapper();

    verboseStandard: boolean = false;

    get(
        path: string,
        headersParam: P | undefined,
        {
            extraHeaders,
            queryParams,
            body,
            verbose = this.verboseStandard,
            statusExpected = responseStatus.ok,
            toBeChecked = true
        }: BackendRequestParams = { verbose: this.verboseStandard, statusExpected: responseStatus.ok }
    ): BackendResponse {
        let request = new BackendRequest(path, BackendRequestMethod.GET, body, extraHeaders, queryParams);
        return this.executeRequest(request, headersParam, verbose, statusExpected, toBeChecked);
    }

    post(
        path: string,
        headersParam: P | undefined,
        {
            extraHeaders,
            queryParams,
            body,
            verbose = this.verboseStandard,
            statusExpected = responseStatus.ok,
            toBeChecked = true
        }: BackendRequestParams = { verbose: this.verboseStandard, statusExpected: responseStatus.ok }
    ): BackendResponse {
        let request = new BackendRequest(path, BackendRequestMethod.POST, body, extraHeaders, queryParams);
        return this.executeRequest(request, headersParam, verbose, statusExpected, toBeChecked);
    }

    delete(
        path: string,
        headersParam: P | undefined,
        {
            extraHeaders,
            queryParams,
            body,
            verbose = this.verboseStandard,
            statusExpected = responseStatus.ok,
            toBeChecked = true
        }: BackendRequestParams = { verbose: this.verboseStandard }
    ): BackendResponse {
        let request = new BackendRequest(path, BackendRequestMethod.DELETE, body, extraHeaders, queryParams);
        return this.executeRequest(request, headersParam, verbose, statusExpected, toBeChecked);
    }

    patch(
        path: string,
        headersParam: P | undefined,
        {
            extraHeaders,
            queryParams,
            body,
            verbose = this.verboseStandard,
            statusExpected = responseStatus.ok,
            toBeChecked = true
        }: BackendRequestParams = { verbose: this.verboseStandard, statusExpected: responseStatus.ok }
    ): BackendResponse {
        let request = new BackendRequest(path, BackendRequestMethod.PATCH, body, extraHeaders, queryParams);
        return this.executeRequest(request, headersParam, verbose, statusExpected, toBeChecked);
    }

    private executeRequest(
        request: BackendRequest,
        headersParam: P | undefined,
        verbose: boolean = this.verboseStandard,
        statusExpected: number = responseStatus.ok,
        toBeChecked: boolean
    ): BackendResponse {
        let headers = this.getHeadersBuilder().build(headersParam);
        headers = Object.assign(headers, request.headers);
        headers['Accept'] = 'application/json;charset=utf-8';
        if (request.method != BackendRequestMethod.GET && request.method != BackendRequestMethod.FORM) {
            headers['Content-Type'] = 'application/json';
        }

        switch (request.method) {
            case BackendRequestMethod.GET:
                return this.getInternal(request, headers, verbose, statusExpected, toBeChecked);
            case BackendRequestMethod.POST:
                return this.postInternal(request, headers, verbose, statusExpected, toBeChecked);
            case BackendRequestMethod.FORM:
                return this.formInternal(request, headers, verbose);
            case BackendRequestMethod.PUT:
                return this.putInternal(request, headers, verbose);
            case BackendRequestMethod.DELETE:
                return this.deleteInternal(request, headers, verbose, statusExpected, toBeChecked);
            case BackendRequestMethod.PATCH:
                return this.patchInternal(request, headers, verbose, statusExpected, toBeChecked);
            case BackendRequestMethod.OPTIONS:
            default:
                throw new Error(`${request.method} is not implemented`);
        }
    }

    private getInternal(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard,
        statusExpected: number = responseStatus.ok,
        toBeChecked?: boolean
    ): BackendResponse {
        return this.execute(request, headers, verbose, statusExpected, toBeChecked);
    }

    private postInternal(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard,
        statusExpected: number = responseStatus.ok,
        toBeChecked?: boolean
    ): BackendResponse {
        if (request.body instanceof FormData) {
            headers['Content-Type'] = `multipart/form-data; boundary=${request.body.boundary}`;
        }
        return this.execute(request, headers, verbose, statusExpected, toBeChecked);
    }

    private formInternal(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard
    ): BackendResponse {
        if (!(request.body instanceof FormData)) {
            throw new Error('Body should be a FormData to send a FORM method');
        }
        headers['Content-Type'] = `multipart/form-data; boundary=${request.body.boundary}`;
        return this.execute(request, headers, verbose);
    }

    private putInternal(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard
    ): BackendResponse {
        headers['X-HTTP-Method-Override'] = 'PUT';
        return this.execute(request, headers, verbose);
    }

    private deleteInternal(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard,
        statusExpected: number = responseStatus.ok,
        toBeChecked?: boolean
    ): BackendResponse {
        headers['X-HTTP-Method-Override'] = 'DELETE';
        return this.execute(request, headers, verbose, statusExpected, toBeChecked);
    }

    private patchInternal(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard,
        statusExpected: number = responseStatus.ok,
        toBeChecked?: boolean
    ): BackendResponse {
        return this.execute(request, headers, verbose, statusExpected, toBeChecked);
    }

    private execute(
        request: BackendRequest,
        headers: Record<string, string>,
        verbose: boolean = this.verboseStandard,
        statusExpected: number = responseStatus.ok,
        toBeChecked?: boolean
    ): BackendResponse {
        let method = BackendRequestMethod[request.method];
        let requestBody: any;
        if (!(request.body instanceof FormData)) {
            requestBody = request.body !== undefined ? JSON.stringify(request.body) : undefined;
        } else {
            requestBody = request.body.body();
        }
        let url = PathResolver.resolve(this.getBaseUrl(), request.path);
        url = PathResolver.resolveQueryParams(url, request.queryParams);
        let response = http.request(method, url.toString(), requestBody, { headers: headers });
        let error;
        if (toBeChecked === false) {
            error = true;
        } else error = checkStatus({ response: response, petitionName: request.path, status: statusExpected });
        verboseLogs(verbose, response, headers, statusExpected, error, method, url, request);
        return this.responseMapper.map(response);
    }
}

export class BackendResponseMapper {
    map(response: RefinedResponse<any>): BackendResponse {
        return new BackendResponse(response);
    }
}

export class BackendResponse {
    get status() {
        return this.originalResponse.status;
    }
    get headers() {
        return this.originalResponse.headers;
    }

    constructor(public originalResponse: RefinedResponse<any>) {}

    public isError() {
        return this.originalResponse.error_code != null;
    }

    public getRawBody(): string {
        return this.originalResponse.body as string;
    }

    public parseResponse<T>(): T {
        return JSON.parse(this.getRawBody()) as T;
    }
}

/**
 * Model containing all required data to execute a request to a backend
 */
export class BackendRequest {
    path: string;
    method: BackendRequestMethod;
    body: BackendBody;
    headers: Record<string, string>;
    queryParams: Record<string, string>;

    constructor(
        path: string,
        method: BackendRequestMethod,
        body?: BackendBody,
        headers?: Record<string, string>,
        queryParams?: Record<string, string>
    ) {
        this.path = path;
        this.method = method;
        this.body = body ?? {};
        this.headers = headers ?? {};
        this.queryParams = queryParams ?? {};
    }
}

export interface BackendRequestParams {
    extraHeaders?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: BackendBody;
    verbose?: boolean;
    statusExpected?: number;
    toBeChecked?: boolean;
}

export type BackendBody = Record<string, string | number | boolean> | FormData;

enum BackendRequestMethod {
    GET,
    POST,
    PUT,
    DELETE,
    FORM,
    PATCH,
    OPTIONS
}

export function verboseLogs(
    verbose: boolean,
    response: RefinedResponse<any>,
    headers: Record<string, string>,
    statusExpected: number,
    error: boolean,
    method: string,
    url: string,
    request: BackendRequest
) {
    if (verbose && error) {
        console.log(`[${response.status}] ${method}-${url}`);
        console.log(`Headers: ${JSON.stringify(headers)}`);
        console.log(`Body: ${response.body}`);
    }
    if (!error) {
        console.log(
            `Error status expected:[${statusExpected}] and status is [${response.status}] on ${method}-${request.path} request`
        );
        console.log(`Error Body: ${response.body}`);
    }
}
