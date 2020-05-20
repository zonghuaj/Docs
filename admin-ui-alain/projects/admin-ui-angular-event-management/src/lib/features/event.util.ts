import {NetResult, processResult} from "admin-ui-angular-common";
import {Observable} from "rxjs";
import {_HttpClient} from "@delon/theme";
import {switchMap} from "rxjs/operators";

export const URL_PREFIX = `../message/api/`;
export const URL_TOOD_PREFIX = `../api/artifactory/`;
/**
 * Belows are the common request unboxing from requests.
 * @param http the _httpClient created
 * @param apiPath request api path
 * @param params parameters to be pass
 */
export function zget<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.get<NetResult<T>>(URL_PREFIX + apiPath, params).pipe(switchMap(processResult));
}

export function zget_todo<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.get<NetResult<T>>(URL_TOOD_PREFIX + apiPath, params).pipe(switchMap(processResult));
}

export function zpost<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.post<NetResult<T>>(URL_PREFIX + apiPath, params).pipe(switchMap(processResult));
}

export function zput<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.put<NetResult<T>>(URL_PREFIX + apiPath, params).pipe(switchMap(processResult));
}

export function zdelete<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  // delete<T> is not supported in current @delon(ng-alain) version
  return http.delete(URL_PREFIX + apiPath, params).pipe(switchMap((res: NetResult<T>) => processResult(res)));
}
