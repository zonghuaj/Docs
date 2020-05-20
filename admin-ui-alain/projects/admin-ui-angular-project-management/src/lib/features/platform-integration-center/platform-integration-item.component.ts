import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {PlatformEntity} from "./platform-integration.entity";

@Component({
  selector: 'platform-integration-item',
  template: `
    <div class="pcard" *ngIf="item">
      <img class="logo" [src]="logo">
      <span class="name">{{item.name}}</span>
      <span class="settle">{{'已集成' + item.settled}}</span>
      <button class="btn"
              nz-button nzType="primary" type="button" nzSize="small"
              (click)="manage$.emit(this.item)">
        集成管理
      </button>
    </div>
  `,
  styles: [`
    .pcard {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px 8px;
      border: 0.5px solid #E8E8E8;
      border-radius: 4px;
      height: 180px;
    }

    .logo {
      max-height: 48px;
      max-width: 120px;
    }

    .name {
      text-align: center;
      margin-top: 4px;
    }

    .settle {
      text-align: center;
      font-size: 12px;
      color: #999;
    }

    .btn {
      margin-top: 4px;
    }
  `]
})
export class PlatformIntegrationItemComponent implements OnInit {

  loading = false;

  @Input() item: PlatformEntity;

  @Output() manage$: EventEmitter<PlatformEntity> = new EventEmitter<PlatformEntity>();

  get logo() {
    return this.item ? LOGOS[this.item.type] : '';
  }

  constructor() {
  }

  ngOnInit(): void {
  }
}

const LOGOS = {
  'gitlab': './assets/images/gitlab.png',
  'harbor': './assets/images/harbor.png',
  'jenkins': './assets/images/jenkins.png',
  'sonar': './assets/images/sonar.png',
};
