import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {NgZone} from '@angular/core';
import {STComponent, STData, STPage} from '@delon/abc';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';

import {ModalHelper, TitleService} from '@delon/theme';
import {DevopsService} from "../../devops.service";
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http'
import {surlWithDeployInfo, surlWithPipelineDetialLog, surlWithUTLog} from "../../devops.utils";
import {URL_BASE as URL_PREFIX, surl} from 'admin-ui-angular-common';
import {Location} from '@angular/common';

@Component({
  selector: 'app-node-log-layout',
  templateUrl: './list.component.html',
  providers: [DevopsService],
  // changeDetection: ChangeDetectionStrategy.OnPush
  styleUrls: ['./list.component.less'],
})
export class PipelineLogComponent implements OnInit, AfterViewInit {

  tabIndex = 0;

  @ViewChild('codeeditor') private codeEditor;
  @ViewChild('codeeditor1') private codeEditor1;
  @ViewChild('codeeditor2') private codeEditor2;
  @ViewChild('codeeditor3') private codeEditor3;
  option: any = {
    // lineNumbers: true,
    mode: 'groovy',
    theme: 'material',
    matchBrackets: true
  };

  codes;
  UTLog;
  deployInfo;
  showMaven = false;
  showArtifactory = false;

  ifFAILED = false;
  ifPASSED = false;
  ifSKIPPED = false;

  FAILEDLog;
  PASSEDLog;
  SKIPPEDLog;

  showPassDiv = false;
  showFailDiv = false;

  pipelineId;
  buildNumber;
  logInfo: any;
  disable = false;
  current = 100;
  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    name: '',
    desc: '',
  };
  pipelineLogs: any;

  @ViewChild('userSt')
  st: STComponent;
  status = true
  // page
  stPage: STPage = {
    front: false,
    zeroIndexed: true
  };

  // used for quality-gate(sonar project key)
  projectKey: string;
  noQualityGate = false;

  constructor(
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private ngz: NgZone,
    private modal: ModalHelper,
    private message: NzMessageService,
    // private http: _HttpClient,
    private route: ActivatedRoute,
    private devopsService: DevopsService,
    private http: HttpClient,
    public location: Location,
    private titleService: TitleService
  ) {
  }

  ngAfterViewInit(): void {
    // const editor = this.codeEditor.codeMirror;
    // editor.setSize('100%', 'auto');
  }

  ngOnInit(): void {
    this.titleService.setTitle('流水线结果');

    this.pipelineId = this.route.snapshot.paramMap.get('pipelineId');
    this.buildNumber = this.route.snapshot.paramMap.get('logId');
    this.getAllDatas();
  }

  getAllDatas() {
    this.getData(this.pipelineId, this.buildNumber);
    this.getUTLog();
    this.getDeployLog();
    this.checkQualityGate();
  }

  /**
   * get pipeline log list data
   */
  getData(pipelineId: number, buildNumber: number) {
    const {pi, ps, name, desc} = this.q;
    this.devopsService.getPipelineBuildNumberLog(pi, ps, pipelineId, buildNumber).subscribe((res: any) => {
      this.pipelineLogs = [...res.stages];
      // get default log
      if (this.pipelineLogs.length != 0) {
        this.clickStep(this.pipelineLogs[0].id);
      }
      for (const re of this.pipelineLogs) {
        re.durationInMillis = `pass in ${re.durationInMillis} ms`
        switch (re.result) {
          case 'UNSTABLE':
            re.result = 'finish';
            break;
          case 'SUCCESS':
            re.result = 'finish';
            break;
          case 'FAILURE':
            re.result = 'error';
            break;
          case 'ABORTED':
            re.result = 'wait';
            break;
          case null:
            re.result = 'wait';
            break;
          case 'NOT_BUILT':
            re.result = 'finish';
            break;

        }
      }
      this.cdr.detectChanges();
    })
  }

  /**
   * get pipeline build number log detail
   */
  async getBuildNumberLogDetial(pipelineId: number, buildNumber: number, logId) {
    const {pi, ps, name, desc} = this.q;
    this.devopsService.getPipelineBuildNumberLogDetail(pipelineId, buildNumber, logId).subscribe((res: any) => {
      this.logInfo = [...res];
      this.cdr.detectChanges();
    })
  }

  /**
   * run pipeline
   * @param id
   */
  runPipeline(item: any) {
    this.devopsService.runPipeline(item.id).subscribe(result => {
      this.msg.success('启动中，请稍候');
    }, err => {
      this.msg.error('部署失败');
    });
  }

  /**
   * stop pipeline
   * @param item
   */
  private stopPipeline(item: STData) {
    this.devopsService.stopPipeline(item.id).subscribe(result => {
      this.msg.success('停止中，请稍候');
    }, err => {
      this.msg.error('停止失败');
    });
    return undefined;
  }

  async clickStep(index) {
    this.current = index;
    await this.getBuildNumberLogDetial(this.pipelineId, this.buildNumber, index)
  }

  getStepLog(isOpen: boolean, panel: any) {
    if (isOpen) {

      this.http.get(URL_PREFIX + 'pipeline/' + surlWithPipelineDetialLog() + `/${this.pipelineId}/${this.buildNumber}/${this.current}/${panel.id}`).subscribe((res: any) => {

        panel.info = res.data;

      });
      // this.devopsService.getPipelineBuildNumberLogDetailText(this.pipelineId, this.buildNumber, this.current, panel.id).subscribe((res: any) => {
      // this.cdr.detectChanges();
      // this.ngz.run(() => {
      //
      // });
      // })
    }
  }

  /**
   * get UT log
   */
  getUTLog() {
    this.http.get(URL_PREFIX + 'pipeline/' + surlWithUTLog() + `/${this.pipelineId}/${this.buildNumber}`).subscribe((res: any) => {
      this.UTLog = res;
      if (this.UTLog.SUMMARY) {
        if (this.UTLog.SUMMARY.failed > 0) {
          this.showFailDiv = true;
        } else {
          this.showPassDiv = true;
        }
        if (this.UTLog.SUMMARY.failed != 0) {
          this.ifFAILED = true;
          this.FAILEDLog = this.UTLog.FAILED;
        }
        if (this.UTLog.SUMMARY.passed != 0) {
          this.ifPASSED = true;
          this.PASSEDLog = this.UTLog.PASSED;
        }
        if (this.UTLog.SUMMARY.skipped != 0) {
          this.ifSKIPPED = true;
          this.SKIPPEDLog = this.UTLog.SKIPPED;
        }
      }
    });
  }

  getDeployLog() {
    this.http.get(URL_PREFIX + 'pipeline/' + surlWithDeployInfo() + `/${this.pipelineId}/${this.buildNumber}`).subscribe((res: any) => {
      this.deployInfo = res.data;
      if (this.deployInfo.maven != null) {
        this.showMaven = true;
      } else {
        this.deployInfo.maven = {groupId: "NANA", artifactid: "NANA", version: "NANA", warehouse: "NANA"}
      }
      if (this.deployInfo.artifactory != null) {
        this.showArtifactory = true;
      } else {
        this.deployInfo.artifactory = {name: "NANA", version: "NANA"}
      }
    });
  }

  checkQualityGate() {
    this.http.get(`${URL_PREFIX}pipeline/${surl('pipelines/' + this.pipelineId)}`)
      .subscribe((res: any) => {
        try {
          this.projectKey = res.data.stages.find(s => s.type === 'CodeCheck').instance.form.projectKey[0];
        } catch (e) {
          this.noQualityGate = true;
        }
      });
  }
}
