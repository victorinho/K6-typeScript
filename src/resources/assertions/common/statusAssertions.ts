import {check} from "k6";
import {RefinedResponse} from "k6/http";


export function checkStatus({
                                response,
                                petitionName,
                                status
                            }: statusParams) {
    check(response, {
        [petitionName + ` status is ${status}`]: (r) => r.status === status,
    });
}


export interface statusParams {
    response: RefinedResponse<any>
    petitionName: string | null
    status: number
}

export enum responseStatus {
    ok = 200,
    unauthorized = 401,
    unprocessableContent = 422
}
