export const environment: any  = {
  SERVER_URL: `./`,
  API_SERVER_URL: ``,
  production: true,
  useHash: true,
  hmr: false,
  executeOtherInterceptors: true, // 是否拦截命中后继续调用后续拦截器的 `intercept` 方法，默认：`true`
  // kcConfig: {
  //   clientId: `micropaas`,
  //   bearerOnly: true,
  //   serverUrl: `http://sso.micropaas.ies/auth`,
  //   // realm: 'myrealm',
  //   response_type: `code`,
  //   callback: `#/callback/keycloak`,
  //   expired: 60 * 9 // 提前多久刷新token，单位是秒
  // }
};
