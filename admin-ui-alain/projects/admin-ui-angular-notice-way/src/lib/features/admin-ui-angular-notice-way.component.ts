import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NoticeWayItem } from '../entities/notice.entities';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUiAngularNoticeWayService } from '../services/admin-ui-angular-notice-way.service';
import { NzMessageService } from 'ng-zorro-antd';
@Component({
  selector: 'admin-ui-angular-notice-way-root',
  templateUrl: './admin-ui-angular-notice-way.component.html',
  styleUrls: ['./admin-ui-angular-notice-way.component.less'],
  providers: [AdminUiAngularNoticeWayService]
})
export class AdminUiAngularNoticeWayComponent implements OnInit {

  cfg: NoticeWayItem[] = [];

  loading: boolean;
  submitLoading: boolean;

  mailSettingV = false;
  mailForm: FormGroup;

  constructor(
    private noticeService: AdminUiAngularNoticeWayService,
    private msg: NzMessageService,
    private fb: FormBuilder,
    public location: Location
  ) {
  }

  ngOnInit(): void {
    this.initMailForm();
    this.getConfigures();
  }

  private getConfigures() {
    this.loading = true;
    this.noticeService.getNoticeWays()
      .subscribe((res: NoticeWayItem[]) => {
        this.loading = false;
        this.cfg = res;
        this.setMailForm();
      }, err => {
        this.msg.error('加载配置失败');
      });
  }

  private initMailForm() {
    this.mailForm = this.fb.group({
      smtpHost: ['', [Validators.required]],
      smtpPort: ['', [Validators.required]],
      smtpMail: ['', [Validators.required]],
      smtpUsername: ['', [Validators.required]],
      smtpPassword: ['', [Validators.required]],
    });
  }

  private setMailForm() {
    try {
      const madv = this.cfg.find(c => c.key === 'email').advance;
      this.mailForm.controls.smtpHost.setValue(madv.smtpHost);
      this.mailForm.controls.smtpPort.setValue(madv.smtpPort);
      this.mailForm.controls.smtpMail.setValue(madv.smtpMail);
      this.mailForm.controls.smtpUsername.setValue(madv.smtpUsername);
      this.mailForm.controls.smtpPassword.setValue(madv.smtpPassword);
    } catch (e) {
    }
  }

  onItemSettingClicked(idx) {
    if (idx === 1) {
      this.mailSettingV = true;
    }
  }

  save() {
    const emCfg = this.cfg.find(c => c.key === 'email')
    if (emCfg && emCfg.enabled && !emCfg.advance.smtpHost) {
      this.msg.error('请填写邮件设置');
      return;
    }

    this.submitLoading = true;
    this.noticeService.saveNoticeWay(this.cfg)
      .subscribe(res => {
        this.msg.success('保存成功');
        this.location.back();
      }, err => {
        this.submitLoading = false;
        this.msg.error('保存失败');
      }
      );
  }

  mailFormSubmit() {
    if (this.checkDirty(this.mailForm)) return;

    this.cfg[1].advance = this.mailForm.value;
    this.mailSettingV = false;
  }

  checkDirty(f: FormGroup) {
    for (const i in f.controls) {
      f.controls[i].markAsDirty();
      f.controls[i].updateValueAndValidity();
    }

    return f.invalid;
  }

}
