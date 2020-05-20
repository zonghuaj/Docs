import {Injectable} from "@angular/core";
import {ZBaseGuard} from "@app/routes/guards/zbase-guard";
import {Router} from "@angular/router";
import {CacheService} from "@delon/cache";

@Injectable({providedIn: 'root'})
export class TenantConsoleGuard extends ZBaseGuard {
  protected constructor(public router: Router, public cache: CacheService) {
    super(router, cache);
  }

  protected getGuardKey(): string {
    return 'tenant-console';
  }
}
