import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {PMonitorEntity} from "./project-monitor.entities";
import {ProjectMonitorService} from "./project-monitor.service";

@Component({
  selector: 'project-monitor-plist',
  templateUrl: './project-monitor-plist.component.html',
  providers: [ProjectMonitorService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMonitorPListComponent implements OnInit {
  widthConfig = ['100px', '100px', '100px', '100px', '100px', '100px', '100px', '100px'];
  monitorDatas: PMonitorEntity[] = [];

  q = {
    type: '',
    isRemaining: '',
    operator: '',
    value: ''
  };
  listLoading = false;

  @Input() times: Date[];

  constructor(private pmService: ProjectMonitorService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.listLoading = true;
    const {type, isRemaining, operator, value} = this.q;
    this.pmService.getPMonitorData(type, isRemaining, operator, value, this.times)
      .subscribe(res => {
        this.listLoading = false;
        this.monitorDatas = res;
        this.cdr.detectChanges();
      }, err => {
        this.listLoading = false;
        this.cdr.detectChanges();
      });
  }

  get queryDisable() {
    return !this.q.type || !this.q.isRemaining || !this.q.operator || !this.q.value;
  }

  clearQuery() {
    this.q = {
      type: null,
      isRemaining: null,
      operator: null,
      value: ''
    };
    this.cdr.detectChanges();
  }
}
