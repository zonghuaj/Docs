import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {AdminUiAngularImageTemplateService} from '../services/admin-ui-angular-image-template.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ImageTemplate} from '../entities/image-template.entity';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'admin-ui-angular-image-template-edit',
  template: `
    <nz-card nzBordered>
      <admin-ui-angular-image-template-form #form [data]="template"
                                            (submit)="onSubmit($event)"></admin-ui-angular-image-template-form>
      <div nz-row nzType="flex" nzJustify="center" class="mt-lg">
        <button nz-button nzType="default" type="default" class="mr-sm"
                (click)="back()">返回
        </button>
        <button nz-button nzType="primary" type="button" [nzLoading]="loading"
                (click)="form.submitForm()">提交
        </button>
      </div>
    </nz-card>
  `,
  styles: [],
  providers: [AdminUiAngularImageTemplateService],
})
export class AdminUiAngularImageTemplateEditComponent implements OnInit {
  loading = false;
  template: ImageTemplate;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private msg: NzMessageService,
              private itService: AdminUiAngularImageTemplateService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.itid;
    if (id) {
      this.getTemplate(id);
    }
  }

  getTemplate(id) {
    this.itService.getTemplateDetail(id).subscribe(res => {
      this.template = res;
    });
  }

  onSubmit(t: ImageTemplate) {
    this.loading = true;
    if (t.id) {
      this.itService.editTemplate(t).subscribe(res => {
        this.loading = false;
        this.msg.success('提交成功');
        this.back();
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
    } else {
      this.itService.createTemplate(t).subscribe(res => {
        this.loading = false;
        this.msg.success('提交成功');
        this.back();
      }, err => {
        this.loading = false;
        this.msg.error('提交失败');
      });
    }
  }

  back() {
    this.location.back();
  }
}

