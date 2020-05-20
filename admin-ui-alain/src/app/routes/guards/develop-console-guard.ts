import {ZBaseGuard} from "@app/routes/guards/zbase-guard";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {CacheService} from "@delon/cache";

@Injectable({providedIn: 'root'})
export class DevelopConsoleGuard extends ZBaseGuard {
  protected constructor(public router: Router, public cache: CacheService) {
    super(router, cache);
  }

  protected getGuardKey() {
    return 'develop-console';
  }
}
