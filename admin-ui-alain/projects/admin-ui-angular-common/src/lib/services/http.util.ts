import { NetResult } from '../entities/net-result.entity';
import { Observable, of, throwError } from 'rxjs';
import { _HttpClient } from '@delon/theme';
import { switchMap } from 'rxjs/operators';
export const URL_BASE = `../api/`;
/**
 * Belows are the common request unboxing from requests.
 * @param http the _httpClient created
 * @param apiPath request api path
 * @param params parameters to be pass
 */
export function get<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.get<NetResult<T>>(URL_BASE + apiPath, params).pipe(switchMap(processResult));
}

export function post<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.post<NetResult<T>>(URL_BASE + apiPath, params).pipe(switchMap(processResult));
}

export function put<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.put<NetResult<T>>(URL_BASE + apiPath, params).pipe(switchMap(processResult));
}

export function deleteMethod<T>(http: _HttpClient, apiPath: string, params?: any): Observable<T> {
  return http.delete(URL_BASE + apiPath, params).pipe(switchMap((res: NetResult<T>) => processResult(res)));
}

/**
 * result detach function
 * @params res
 */
export function processResult<T>(res: NetResult<T>): Observable<T> {
  if (res.code === 1) {
    return of(res.data);
  } else {
    return throwError(res.error);
  }
}

/**
 * For some api we need to call without any data process from node server,
 * use this function to pass/get data.
 * @param http _httpClient
 * @param options
 *        - api: api need to pass through, like 'kubernetes'
 *        - method: GET/POST/...
 *        - path: actual resource
 *        - data: data passed
 */
export function zrequestthru<T>(
  http: _HttpClient,
  options: {
    api: string,
    method: string,
    path: string,
    data?: any
  }): Observable<T> {
  const { api, method, path, data } = options;
  const body = { method, path, data };
  return post<T>(http, api, body);
}

export function surl(targetPath: string) {
  return `$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}
export function surlWithoutProject(targetPath: string) {
  return `$TENANT_ID/${targetPath}`;
}
