// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: any = {
  SERVER_URL: `./`,
  production: false,
  useHash: true,
  hmr: false,
  executeOtherInterceptors: true, // 是否拦截命中后继续调用后续拦截器的 `intercept` 方法，默认：`true`
  // kcConfig: {
  //   clientId: `micropaas`,
  //   bearerOnly: true,
  //   serverUrl: 'http://sso.micropaas.ies/auth',
  //   response_type: `code`,
  //   callback: `#/callback/keycloak`,
  //   expired: 60 * 5 // 提前多久刷新token，单位是秒
  // }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
