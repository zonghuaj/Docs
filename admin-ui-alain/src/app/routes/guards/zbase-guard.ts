import {
  ActivatedRouteSnapshot, CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {CacheService} from "@delon/cache";

export abstract class ZBaseGuard implements CanActivate, CanActivateChild {
  protected disable = false;

  accessableMenus: string[] = [];

  protected constructor(public router: Router, public cache: CacheService) {
    const menus = JSON.parse(localStorage.getItem('acc-menus'));
    const guardKey = this.getGuardKey();
    if (menus[guardKey]) {
      const pmenu = menus[guardKey][this.cache.getNone<string>('projectCode')];
      this.accessableMenus = [...this.accessableMenus, ...pmenu];
    }
  }

  protected abstract getGuardKey(): string;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.disable) return true;

    const canActive = this.accessableMenus.some(m => new RegExp(m).test(state.url));
    if (!canActive) {
      this.router.navigate(['exception/401']);
    }

    return canActive;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
