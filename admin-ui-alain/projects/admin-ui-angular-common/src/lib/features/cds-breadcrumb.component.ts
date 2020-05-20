import { Component, OnInit } from '@angular/core';
import { Menu } from '@delon/theme';
import { AppMenuService } from '@cds/framework';
import {MpHeaderService} from "../services/mp-header.service";

interface PageHeaderPath {
  title?: string;
  i18n?: string;
  url?: string[];
}

@Component({
  selector: 'cds-breadcrumb',
  templateUrl: `./cds-breadcrumb.component.html`,
  styleUrls: ['./cds-breadcrumb.component.less'],
})
export class CdsBreadcrumbComponent implements OnInit {
  paths: PageHeaderPath[] = [];
  private _menus: Menu[] | null;

  constructor(
    private appMenuSrv: AppMenuService,
    private headerService: MpHeaderService,
  ) {
  }

  ngOnInit(): void {
    this.genBreadcrumb();
    this.setHeaderTitle();
  }

  private get menus() {
    if (this._menus) {
      return this._menus;
    }
    this._menus = this.appMenuSrv.getBreadcrumb();
    return this._menus;
  }

  private genBreadcrumb() {
    if (this.menus.length <= 0) {
      this.paths = [];
      return;
    }
    const paths: PageHeaderPath[] = [];
    this.menus.forEach(item => {
      if (
        typeof item.hideInBreadcrumb !== 'undefined' &&
        item.hideInBreadcrumb
      ) {
        return;
      }
      if (!item.url) {
        return;
      }
      paths.push(item);
    });
    // add home
    paths.splice(0, 0, {
      title: '首页',
      url: ['/'],
    });
    this.paths = paths;
    return this;
  }

  private setHeaderTitle() {
    if (this.menus.length === 0) return;

    const title = this.menus[this.menus.length - 1].i18n;
    this.headerService.setTitle(title);

    return this;
  }
}
