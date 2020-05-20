import {Component, Inject, OnInit} from '@angular/core';
import {DA_SERVICE_TOKEN, ITokenService, SocialService} from '@delon/auth';
import { v4 as uuid } from 'uuid';
import { environment } from '@env/environment';
import { CacheService } from '@delon/cache';
import {_HttpClient, SettingsService} from '@delon/theme';
import { debug } from 'util';
@Component({
  selector: 'app-keycloak-forward',
// tslint:disable-next-line: max-line-length
  template: `<div class="preloader"><div class="cs-loader"><div class="cs-loader-inner"><label>	●</label><label>	●</label><label>	●</label><label>	●</label><label>	●</label><label>	●</label></div></div>`,
  styleUrls: ['./forward.component.less'],
  providers: [SocialService],
})
export class KeykloakForwardComponent implements OnInit {

  constructor(
    private socialService: SocialService,
    private cacheService: CacheService,
    private http: _HttpClient,
    private settingService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }


  ngOnInit(): void {
    this.tryClearPrevToken();

    const uuidCode = uuid();
    // const callback = 'http://localhost:4200/#/callback/keycloak';

    // const kcConfig: any = environment.kcConfig;

    this.http.get<any>('./assets/config/keycloak.json').subscribe((kcConfigs: any) => {

      const tenantPath = location.pathname;

      const callbackUrl = `${location.origin + location.pathname}#/callback/keycloak`;
      const href = `${kcConfigs.keycloakUrl}/realms${tenantPath}` +
          'protocol/openid-connect/auth' +
          `?client_id=micropaas` +
          `&state=${encodeURIComponent(uuidCode)}` +
          `&scope=${encodeURIComponent('openid address phone')}` +
          '&scope=' + encodeURIComponent( 'openid address phone') +
          `&response_type=code` +
          '&redirect_uri=' + encodeURIComponent(callbackUrl);
      this.socialService.login(href, encodeURIComponent(callbackUrl), {
          type: 'href',
      });
    });
    // location.href = href;
  }

  /**
   * See https://jira.atcdevops.accenture.cn/projects/MP/issues/MP-239
   * I add this method to clear the token we stored before, in case any multiple logon happend.
   */
  tryClearPrevToken() {
    this.settingService.setUser(null);
    this.cacheService.clear();
    this.tokenService.clear();
  }
}
