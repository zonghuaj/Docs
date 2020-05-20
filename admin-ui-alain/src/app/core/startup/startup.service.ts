import {
  Injectable,
  Injector,
  Inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {of, zip} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {
  MenuService,
  SettingsService,
  TitleService,
  ALAIN_I18N_TOKEN,
  _HttpClient,
} from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService, JWTTokenModel } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService, NzMessageService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';

import { CacheService } from '@delon/cache';

// @ts-ignore
import { version } from '../../../../package.json';
import { zpost, surlWithoutProject } from '@app/services/services.util';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
    public cache: CacheService,
    private http: _HttpClient,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    this.registerVersion();
  }

  private viaHttp(resolve: any, reject: any) {
    // const accessInfoUrl = surlWithoutProject('user/accessInfo');
    const umaUrl = surlWithoutProject('accessInfo');
    zip(
      this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
      // this.httpClient.get(`../api/${accessInfoUrl}`),
      this.httpClient.get(`../api/uma/${umaUrl}`).pipe(
        switchMap((res: any) => of(res.data))
      ),
    )
      .pipe(
        // 接收其他拦截器后产生的异常消息
        catchError(([langData, menus]) => {
          resolve(null);
          return [langData,  menus];
        }),
      )
      .subscribe(
        ([langData, menus]) => {
          // setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);
          this.aclService.setFull(true);

          // save menus
          localStorage.setItem('acc-menus', JSON.stringify(menus));

          // // 初始化菜单
          // this.menuService.add(res.menu);
          // // 设置页面标题的后缀
          // this.titleService.suffix = res.app.name;
          // const jwt =  this.tokenService.get<JWTTokenModel>(JWTTokenModel);

          // if (!jwt.token) {
          //   this.injector.get(Router).navigateByUrl('/passport/keycloak');
          //   resolve({});
          //   return;
          // }
          // if (jwt && jwt.payload && jwt.payload.authorization && jwt.payload.authorization.permissions){
          //   const permissions = jwt.payload.authorization.permissions;
          //   permissions.forEach(element => {
          //       if(element.rsname.indexOf('ui:menu:') > 0){
          //          const menu =  element.rsname.startsWith('ui:menu:');
          //          this.aclService.add(menu);
          //       }
          //   });
          // }

          // const resources: any[] = accessInfo.data;
          // if (resources && resources.length > 0) {
            // this.aclService.setRole(roles);

            // --- this project setting config is not used anymore, see #configProjectList() ---
            // const projects = resources
            //   .filter(item => item.rsname.startsWith('project:'))
            //   .map(item => item.rsname.split(':')[1]);
            // this.settingService.user.projects = projects;
            // if (!this.cache.get('projectCode')) {
            //   this.cache.set('projectCode', projects[0]);
            // }
            resolve({});
          // } else {
            // this.msgService.error('当前用户没有任何权限，请联系管理员分配权限');
          // }

          if (
            this.settingService.user &&
            this.settingService.user.micropaas_roles
          ) {
            this.aclService.setRole(this.settingService.user.micropaas_roles);
            // this.aclService.setRole(['system-admin'] );

            // this.menuSrv.resume();
          }

          const app: any = {
            name: `MicroPaas Admin`,
            description: `MicroPaas管理页面`,
          };
          // 初始化菜单
          // this.menuService.add(fullMenu);
          // 设置页面标题的后缀
          this.titleService.suffix = app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private async viaMockI18n(resolve: any, reject: any) {
    // 设置当前租户
    const pathName = location.pathname;
    if (pathName) {
      const end = pathName.lastIndexOf('/');
      const tenantId =
        end > 0 ? pathName.substring(1, end) : pathName.substring(1);
      this.cache.set('tenantId', tenantId);
    } else {
      return;
    }

    // 判断是否为登陆回调得请求
    let urlQueryString = location.href;
    if (urlQueryString.indexOf('?') === -1) {
    }
    urlQueryString = location.search.substr(1);
    // const router =  location.hash
    const params = urlQueryString.split('&');
    if (
      location.hash !== undefined &&
      location.hash.startsWith('#/callback/') &&
      params[2] !== undefined
    ) {
      const code = params[2].substr('code='.length);
      const param = { code };
      const tokenResult = await zpost(
        this.http,
        `../api/uma/${surlWithoutProject('public/token')}`,
        param,
      );
      tokenResult.subscribe(
        (data: any) => {
          if (data) {
            const token = data.token;
            const userInfo = data.userInfo;
            this.settingService.setUser({
              ...this.settingService.user,
              ...userInfo,
            });
            userInfo.token = token.access_token;
            token.token = token.access_token;
            // this.socialService.callback(userInfo);
            this.tokenService.set(token);
            if (data.userInfo && data.userInfo.micropaas_roles) {
              this.aclService.setRole(data.userInfo.micropaas_roles);
              // this.aclService.setRole(['system-admin'] );
              // this.menuSrv.resume();
            }
            this.viaHttp(resolve, reject);
          }
        },
        err => {
          // this.msg.error('获取列表失败');
        },
      );
    } else {
      this.viaHttp(resolve, reject);
    }
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      this.viaMockI18n(resolve, reject);
    });
  }

  registerVersion() {
    (window as any).version = () => {
      console.log('MicroPaaS Admin UI:');
      console.log(`version ------ ${version}`);
    };
  }
}
