import {Injectable} from "@angular/core";
import {AppMenuService} from "@cds/framework";
import {TitleService} from "@delon/theme";

@Injectable({providedIn: 'root'})
export class MpHeaderService {
  constructor(private appMenuService: AppMenuService,
              private titleService: TitleService) {
    titleService.prefix = '';
    titleService.suffix = '';
    titleService.separator = '';
  }

  setTitle(title?: string) {
    if (!title) {
      try {
        const bc = this.appMenuService.getBreadcrumb();
        title = bc[bc.length - 1].i18n || bc[bc.length - 1].title;
      } catch (e) {
        title = 'Admin UI';
      }
    }

    this.titleService.setTitle(title);
  }
}
