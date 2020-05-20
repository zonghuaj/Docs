import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {isEmpty} from "@delon/util";

@Component({
  selector: 'exception-401',
  template: `
    <div class="c" style="min-height: 500px; height: 80%;">
      <div class="left">
        <div class="img" [ngStyle]="{'background-image': 'url(' + _img + ')'}"></div>
      </div>
      <div class="right">
        <div class="desc"
             [innerHTML]="'对不起，您无权查看此页面'"></div>
        <div class="con">
          <button *ngIf="!hasCon"
                  nz-button
                  [routerLink]="['/']"
                  [nzType]="'primary'">返回首页
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .c {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .img {
      float: right;
      width: 100%;
      max-width: 430px;
      height: 360px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: 100% 100%;
    }

    .left {
      flex: 0 0 62.5%;
      padding-right: 120px;
    }

    .right {
      flex: 0 0 auto;
    }

    .desc {
      color: #444444;
      font-size: 25px;
      line-height: 40px;
      margin-bottom: 16px;
    }

    .con {
    }
  `]
})
export class Exception401Component {
  _desc = '';
  _img = 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg';
  hasCon = false;
  @ViewChild('conTpl')
  private conTpl: ElementRef;

  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }

  checkContent() {
    this.hasCon = !isEmpty(this.conTpl.nativeElement);
  }
}
