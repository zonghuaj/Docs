import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {BaseFormComponent} from "admin-ui-angular-common";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {PipelineStage, PipelineTemplateParam} from "../pipeline-template.entities";
import {PipelineTemplateProcessService} from "../pipeline-template-process.service";
import {PipelineTemplateService} from "../pipeline-template.service";
import {Location} from "@angular/common";
import {NzMessageService, NzModalService} from "ng-zorro-antd";

@Component({
  selector: 'pipeline-template-params',
  templateUrl: './pipeline-template-params.component.html',
  styles: [`
    pipeline-template-params .ant-steps-item-process .ant-steps-item-icon {
      background: #49a9ee;
      border-color: #49a9ee;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [PipelineTemplateService]
})
export class PipelineTemplateParamsComponent extends BaseFormComponent<DumbPipelineTemplateParam> {
  @Output() prev$ = new EventEmitter();

  params: PipelineTemplateParam[];
  stages: PipelineStage[];

  submitLoading = false;

  constructor(private fb: FormBuilder,
              private ppService: PipelineTemplateProcessService,
              private ptService: PipelineTemplateService,
              private msg: NzMessageService,
              private location: Location,
              private modalService: NzModalService) {
    super();
  }

  ngOnInit(): void {
    this.params = this.ppService.getParams();
    super.ngOnInit();

    this.stages = this.ppService.getStages();
  }

  initForm(): FormGroup {
    return this.form = this.fb.group({
      dumb: this.fb.array(this.getParamsFCtrl())
    });
  }

  get dumb() {
    return this.form.controls.dumb as FormArray;
  }

  getParamVal(i, key) {
    return (this.dumb.controls[i] as FormGroup).controls[key].value;
  }

  getParamsFCtrl(): any[] {
    return this.params.map(p => {
      const {key, label, defValue, promptMessage} = p;
      return this.fb.group({
        key: [key],
        label: [label],
        defValue: [defValue],
        promptMessage: [promptMessage]
      });
    });
  }

  _submitForm(d: DumbPipelineTemplateParam): DumbPipelineTemplateParam {
    return d.dumb as any;
  }

  onSubmit() {
    if (this.stages.length === 0) {
      this.modalService.confirm({
        nzContent: '当前模板代码并未检出任何<b style="color: red;">name</b>，确定提交吗？',
        nzOnOk: () => this.submitTemplate()
      });
    } else {
      this.submitTemplate();
    }
  }

  submitTemplate() {
    const params = this.submitForm();
    this.ppService.setParameters(params);
    this.submitLoading = true;
    const template = this.ppService.currTemplate;
    this.ptService.createTemplate(template).subscribe(res => {
      this.submitLoading = false;
      this.msg.success('创建成功');
      this.location.back();
    }, err => {
      this.submitLoading = false;
      this.msg.error('创建失败');
    });
  }
}

class DumbPipelineTemplateParam {
  dumb: PipelineTemplateParam[];
}
