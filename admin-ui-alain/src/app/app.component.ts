import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  Inject,
} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {_HttpClient, SettingsService, TitleService} from '@delon/theme';
import {VERSION as VERSION_ALAIN} from '@delon/theme';
import {VERSION as VERSION_ZORRO, NzModalService} from 'ng-zorro-antd';
import {DA_SERVICE_TOKEN, ITokenService, JWTTokenModel} from '@delon/auth';
import {
  AppMenuService,
  TopNavService,
  FrameworkService,
} from '@cds/framework';

import {primaryConfig} from './navigation/topNav';
import {serviceMenu} from './navigation/appMenu';
import {CdsAppMenuItem} from "@cds/framework/lib/types";
import {EventListEntity, EventManageService} from "admin-ui-angular-event-management";
import {format} from "date-fns";
import {BehaviorSubject} from "rxjs";
import {CacheService} from "@delon/cache";
import {zpost, surlWithoutProject} from "@app/services/services.util";

import {MpHeaderService} from "admin-ui-angular-common";

@Component({
  selector: 'app-root',
  // template: `<router-outlet></router-outlet>`,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  accessableMenus;

  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private headerSrv: MpHeaderService,
    private modalSrv: NzModalService,
    private frameworkService: FrameworkService,
    private appMenuService: AppMenuService,
    private topNavService: TopNavService,
    private eventService: EventManageService,
    private settingService: SettingsService,
    public cache: CacheService,
    private http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    renderer.setAttribute(
      el.nativeElement,
      'ng-alain-version',
      VERSION_ALAIN.full,
    );
    renderer.setAttribute(
      el.nativeElement,
      'ng-zorro-version',
      VERSION_ZORRO.full,
    );
  }

  ngOnInit() {
    this.accessableMenus = JSON.parse(localStorage.getItem('acc-menus'));

    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.headerSrv.setTitle();
        this.modalSrv.closeAll();
      });

    // cds framework config
    this.configTheme();
    this.configTopNav();
    this.configAppMenu();
    this.configUserInfo();
    this.configProjectList();
    this.configMessage();
  }

  // 设置主题, 推荐是用 此方式这只 framework 的布局和 layout
  configTheme() {
    this.frameworkService.setConfig({
      theme: 'green', // white, dark, green
      noMessage: false,
      noLanguageToggle: true,
      logoImageUrl: 'GREEN_FULL_REV',
      commercial: true,
    });
  }

  configTopNav() {
    // 设置 顶栏主导航
    this.topNavService.setPrimaryMenuConfig(primaryConfig);

    // 设置 顶栏次级导航, 不需要时注释掉
    // this.topNavService.setSecondaryConfig(secondaryConfig);

    // 设置搜索样式 inline, icon, disable. 默认 inline
    this.topNavService.setSearchConfig({
      searchModel: 'disable',
      placeholder: '',
    });
  }

  configAppMenu() {
    const aclMenu = [...serviceMenu];
    this.checkMenuHide(aclMenu.find(m => m.id === 'project-console'));
    // 'develop-console' is same as 'project-console'
    const pmenu = this.accessableMenus['project-console'];
    aclMenu.find(m => m.id === 'develop-console').hidden = !pmenu || pmenu.length === 0;
    this.checkMenuHide(aclMenu.find(m => m.id === 'tenant-console'));
    this.checkMenuHide(aclMenu.find(m => m.id === 'platform-console'));

    this.appMenuService.register('service', aclMenu);
    this.appMenuService.setCurrentNavigation('service');
  }

  checkMenuHide(menu: CdsAppMenuItem) {
    const m = this.accessableMenus[menu.id];
    menu.hidden = !m || m.length === 0;
  }

  configUserInfo() {
    this.topNavService.setSearchConfig({
      placeholder: '',
      searchModel: 'disable',
    });

    const user = this.settingService.user;
    this.topNavService.setUserInfo({
      id: 'user',
      name: user.name,
      title: user.email,
      photo: user.avatar, // || './assets/images/avatar.png',
      menu: [
        {
          id: '',
          title: '',
          i18n: '个人设置',
          url: ['/team/account'],
          banner: true,
        },
        {
          id: '',
          title: '',
          i18n: '退出登录',
          onClick: () => {
            this.logout();
          },
        },
      ],
      login: {
        title: 'Login',
        url: '/login',
      },
    });
    // this.userService.getUser().subscribe(userInfo => {
    //   this.topNavService.setUserInfo(userInfo);
    // });
  }

  logout() {
    const tokenUrl = 'api/user/logout';
    const token = this.tokenService.get<JWTTokenModel>(JWTTokenModel);
    zpost(this.http, `../api/uma/${surlWithoutProject('user/logout')}`, {
      refresh_token: token['refresh_token'],
    }).subscribe(
      (data: any) => {
        if (!data.error) {
          this.settingService.setUser(null);
          this.cache.clear();
          this.tokenService.clear();
          this.router.navigateByUrl(this.tokenService.login_url);
        }
      },
      err => {
        // this.msg.error('获取列表失败');
      },
    );
  }

  messageReqEmitter$ = new BehaviorSubject<EventListEntity>({
    count: 0,
    rows: [],
  });

  configMessage() {
    this.eventService._setUnreadMsgObserved(this.messageReqEmitter$);
    this.eventService.startWatchingMsg();

    this.messageReqEmitter$.subscribe((msgs: EventListEntity) => {
      this.topNavService.setMessage({
        title: '事件中心',
        noMessageTitle: '无新事件',
        unread: msgs.count,
        messages: msgs.rows.map(m => ({
          id: 'msg' + m.id,
          title: m.message,
          date: format(m.createAt, 'YYYY-MM-DD HH:mm:ss'),
          url: ['/event/list/:type'],
          
          // onClick :()=>{
          //   localStorage.setItem('event-list-type',m.type);
          //   window.open("#/event/list", "_self");
          //   window.postMessage('message','*');
          // }
          urlParam: {
             'type':  m.type
          }
        })),
        messageCenter: {
          id: 'message-center',
          title: '全部事件',
          url: ['/event/list/:type'],
          urlParam: {
            'type':  'alert'
         }
        },
      });
    });

    this.topNavService.setMessage({
      title: '事件中心',
      noMessageTitle: '无新事件',
      unread: false,
      messages: [],
      messageCenter: {
        id: 'message-center',
        title: '全部事件',
        url: ['/event/list/:type'],
        urlParam: {
          'type':  'alert'
       }
      },
    });
  }

  configProjectList() {
    try {
      const projects = Object.keys(this.accessableMenus['project-console']);
      this.settingService.user.projects = projects;

      let savedProj = this.cache.getNone('projectCode') as string;
      if (projects.indexOf(savedProj) < 0) {
        this.cache.set('projectCode', projects[0]);
        savedProj = projects[0];
      }

      this.topNavService.setSecondaryConfig([
        {
          id: savedProj,
          title: savedProj,
          url: [],
          children: [
            ...projects.map(p => ({
              id: p,
              title: p,
              url: [''],
              onClick: () => {
                if (p !== savedProj) {
                  this.changeProject(p);
                }
              },
            })),
          ],
        },
      ]);
    } catch (e) {
    }
  }

  changeProject(proj: string) {
    // this.currentProjectCode = projectCode;
    this.cache.set('projectCode', proj);
    setTimeout(() => document.location.reload());
  }
}
