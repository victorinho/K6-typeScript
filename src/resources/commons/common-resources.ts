import { RefinedResponse } from 'k6/http';

export function parseJson(response: RefinedResponse<any>) {
  return JSON.parse(<string>response.body);
}

export function checkJsonNull(json: any) {
  let response: boolean = false;
  if (json == null) {
    response = true;
  }
  return response;
}

export function getParseLength(json: any) {
  let len: number = json.length;
  return len;
}
