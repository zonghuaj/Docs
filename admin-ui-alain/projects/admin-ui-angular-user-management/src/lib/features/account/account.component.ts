import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import {_HttpClient, SettingsService} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd';
import {AccountService} from "./account.service";

@Component({
  selector: 'user-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AccountService]
})
export class AccountComponent implements OnInit {

  constructor(private http: _HttpClient, private cdr: ChangeDetectorRef, private msg: NzMessageService,
              private settings: SettingsService, private accountService: AccountService) {
  }

  updatePassword: any = {oldPassword: '', newPassword: '', configNewPassword: ''}
  userLoading = true;
  avatar = '';
  user: any;
  passwordErr = ''
  passwordBoolean = false;
  disabled = true;
  canSubmit = true;

  ngOnInit(): void {
    // get user info
    this.user = this.settings.user;
    this.userLoading = false;
    this.cdr.detectChanges();
  }

  // #endregion
  save() {
    this.accountService.update(this.user)
      .subscribe(res => {
        this.msg.success('修改成功');
        this.cdr.detectChanges();
      }, (err) => {
        this.msg.error('修改失败');
        this.cdr.detectChanges();
      });
  }

  savePassword() {
    this.accountService.updatePassword(this.updatePassword)
      .subscribe(res => {
        this.msg.success('修改成功');
        this.cdr.detectChanges();
      }, (err) => {
        this.msg.error('修改失败');
        this.cdr.detectChanges();
      });
  }

  validateNewPassword(f: boolean) {
    if (this.updatePassword.newPassword && this.updatePassword.configNewPassword) {
      if (this.updatePassword.newPassword !== this.updatePassword.configNewPassword) {
        this.passwordErr = '两次新密码不相同!';
        this.passwordBoolean = true;
        this.canSubmit= true;
        this.cdr.detectChanges();
      } else {
        this.passwordBoolean = false;
        this.canSubmit= false;
        this.cdr.detectChanges();
      }
    }
  }
}
