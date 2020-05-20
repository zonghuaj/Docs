import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SocialService, DA_SERVICE_TOKEN, ITokenService, JWTTokenModel} from '@delon/auth';
import {SettingsService, MenuService} from '@delon/theme';
import {ACLService} from '@delon/acl';
import {CacheService} from '@delon/cache';
import {CallbackService} from './callback.service';
import {NzMessageService} from 'ng-zorro-antd';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-callback',
  template: ``,
  providers: [SocialService, CallbackService],
})
export class CallbackComponent implements OnInit {
  type: string;
  code: string;

  constructor(
    private socialService: SocialService,
    private settingsSrv: SettingsService,
    private route: ActivatedRoute,
    private aclService: ACLService,
    private cacheService: CacheService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router,
    private callbackService: CallbackService,
    private msgService: NzMessageService,
    private menuSrv: MenuService,
    @Inject(DOCUMENT) private doc: any,
  ) {
  }

  ngOnInit(): void {
    this.tryRedirectFromKeyclock();
    // this.type = this.route.snapshot.params.type;
    // this.code = this.route.snapshot.queryParams.code;
    // this.callbackService.getToken(this.code)
    // .subscribe((data: any) => {
    //   if (data ) {
    //       const token = data.token;
    //       const userInfo = data.userInfo;
    //       this.settingsSrv.setUser({
    //         ...this.settingsSrv.user,
    //         ...userInfo,
    //       });
    //       userInfo.token = token.access_token;
    //       token.token = token.access_token;
    //       this.socialService.callback(userInfo);
    //       this.tokenService.set(token);
    //       if (data.userInfo && data.userInfo.micropaas_roles) {
    //         this.aclService.setRole(data.userInfo.micropaas_roles);
    //         // this.aclService.setRole(['system-admin'] );
    //         this.menuSrv.resume();
    //       }

    //       this.doc.location.reload('/');
    //       // this.router.navigateByUrl('/');
    //     } else {

    //     }
    // }, (err) => {
    //   // this.msg.error('获取列表失败');
    // });

  }

  private mockModel() {
    // const info = {
    //   token: '123456789',
    //   name: 'cipchk',
    //   email: `${this.type}@${this.type}.com`,
    //   id: 10000,
    //   time: +new Date(),
    // };
    // this.settingsSrv.setUser({
    //   ...this.settingsSrv.user,
    //   ...info,
    // });
    // this.socialService.callback(info);
  }

  private tryRedirectFromKeyclock() {
    if (this.route.snapshot.params.type !== 'keycloak') return;

    this.router.navigateByUrl('', {replaceUrl: true});
  }
}
