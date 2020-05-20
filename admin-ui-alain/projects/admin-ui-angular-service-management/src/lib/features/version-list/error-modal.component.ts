import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {ServiceListService} from "../service-list/service-list.service";

@Component({
  selector: 'error-modal',
  template: `<p>{{content}}</p>`,
  providers: [ServiceListService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorModalComponent implements OnInit {
  content: string;

  @Input() sid;
  @Input() vid;

  constructor(private servListService: ServiceListService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.servListService.getDeployError(this.sid, this.vid)
      .subscribe((res: any) => {
        this.content = res.message;
        this.cdr.detectChanges();
      });
  }
}
