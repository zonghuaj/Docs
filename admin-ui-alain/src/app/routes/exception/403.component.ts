import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {AppMenuService} from "@cds/framework";
import {TitleService} from "@delon/theme";

@Component({
  selector: 'exception-403',
  template: `
    <exception type="403"
               style="min-height: 500px; height: 80%;"
               [desc]="desc"></exception>`,
})
export class Exception403Component implements OnInit, AfterViewInit {
  desc: string;

  constructor(modalSrv: NzModalService,
              private titleServ: TitleService,
              private appMenuSrv: AppMenuService,) {
    modalSrv.closeAll();
  }

  isEmptyMenu;

  ngOnInit(): void {
    this.titleServ.setTitle('403');
    const nav = this.appMenuSrv.getCurrentNavigation();
    this.isEmptyMenu = nav && nav.every(n => n.hidden);
    if (this.isEmptyMenu) {
      this.appMenuSrv.toggleMenu();
      this.desc = '您当前没有任何权限访问，请联系相关管理人员';
    } else {
      this.desc = '抱歉，您无权访问该页面';
    }
  }

  ngAfterViewInit(): void {
    if (this.isEmptyMenu) {
      document.querySelector<any>('div.exception__cont-actions > button').style.visibility = 'hidden';
    }
  }
}
