import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AlertEntity } from '../entities/alert.entities';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'alert-confirm-modal',
  template: `
    <sv-container class="mb-md" col="1" labelWidth="100">
      <sv label="标题">{{data.summary}}</sv>
      <sv label="详细描述">{{data.description}}</sv>
      <sv label="认领人" *ngIf="data.status === 2">{{data.claim_user}}</sv>
      <sv label="解决方案" *ngIf="data.status === 2">{{data.solution}}</sv>
    </sv-container>

    <se-container col="1" labelWidth="100" *ngIf="data.status === 1">
      <se label="解决方案" error="请输入解决方案" required>
        <textarea nz-input placeholder="请输入解决方案" rows="3" style="resize:none;" [(ngModel)]="solution"></textarea>
      </se>
    </se-container>
  `,
})
export class AlertConfirmComponent implements OnInit {
  @Input() data: AlertEntity;

  solution: string;

  constructor(private modal: NzModalRef) {
  }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy({ solution: this.solution });
  }
}
