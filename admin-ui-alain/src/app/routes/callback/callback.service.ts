import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs';
import { _HttpClient, SettingsService } from '@delon/theme';
import { SocialService, DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import {zpost, surlWithoutProject} from "@app/services/services.util";

@Injectable()
export class CallbackService {

  constructor(private http: _HttpClient,
              private settingsSrv: SettingsService,
              private socialService: SocialService,
              @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }


  getToken(code: string): Observable<any> {
    const param = {
      code
    };
    return zpost(this.http, surlWithoutProject(`public/token`), param);
  }
}
