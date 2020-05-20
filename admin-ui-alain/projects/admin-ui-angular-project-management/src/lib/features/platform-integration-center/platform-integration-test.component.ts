import {
  Component,
  Input,
  OnInit,
} from "@angular/core";
import {PlatformIntegrationService} from "./platform-integration.service";

@Component({
  selector: 'platform-integration-test',
  template: `
    <div *ngIf="loading && !result">
      <i nz-icon nzType="loading" nzTheme="outline"></i>
      正在尝试连接
    </div>
    <div *ngIf="result">
      <i *ngIf="result.success" nz-icon nzType="check" nzTheme="outline" style="color: green"></i>
      <i *ngIf="!result.success" nz-icon nzType="close" nzTheme="outline" style="color: red;"></i>
      {{result.description}}
    </div>
  `,
  styles: [``],
  providers: [PlatformIntegrationService]
})
export class PlatformIntegrationTestComponent implements OnInit {

  loading = false;

  result: {
    success: boolean,
    description: string;
  };

  @Input() item: any;

  constructor(private piService: PlatformIntegrationService,) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.piService.testPlatform(this.item)
      .subscribe(res => {
        this.loading = false;
        this.result = {
          success: true,
          description: '连接正常！'
        };
      }, err => {
        this.loading = false;
        this.result = {
          success: false,
          description: '请求失败，可能是参数错误或者无法连接。'
        };
      });
  }
}
