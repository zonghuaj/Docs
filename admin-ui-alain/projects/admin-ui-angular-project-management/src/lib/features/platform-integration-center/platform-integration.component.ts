import {Component, HostListener, OnInit} from "@angular/core";
import {PlatformEntity} from "./platform-integration.entity";
import {ModalHelper} from "@delon/theme";
import {PlatformIntegrationService} from "./platform-integration.service";

@Component({
  selector: 'platform-integration',
  template: `
    <cds-breadcrumb></cds-breadcrumb>

    <nz-card nzBordered nzTitle="集成中心" *ngIf="!showingItem">
      <nz-row nzGutter="16">
        <platform-integration-item nz-col [nzSpan]="4"
                                   *ngFor="let i of items"
                                   [item]="i" (manage$)="onItemClicked($event)"></platform-integration-item>
      </nz-row>
    </nz-card>

    <platform-integration-list *ngIf="showingItem" [platform]="showingItem" (onBack$)="back()">
    </platform-integration-list>
  `,
  providers: [PlatformIntegrationService],
})
export class PlatformIntegrationComponent implements OnInit {
  loading = false;

  items: PlatformEntity[] = [];

  showingItem: PlatformEntity;

  constructor(private modal: ModalHelper,
              private piService: PlatformIntegrationService) {
  }

  ngOnInit(): void {
    this.getDatas();
  }

  getDatas() {
    this.piService.getAllSupportedPlatforms().subscribe(res => {
      this.items = res;
    });
  }

  onItemClicked(platform: PlatformEntity) {
    this.showingItem = platform;
  }

  back() {
    this.showingItem = null;
    this.getDatas();
  }
}
