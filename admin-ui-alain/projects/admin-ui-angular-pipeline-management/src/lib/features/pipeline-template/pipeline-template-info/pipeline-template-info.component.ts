import {Component, EventEmitter, Output, ViewEncapsulation,} from '@angular/core';
import {BaseFormComponent} from "admin-ui-angular-common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PipelineTemplateInfo} from "../pipeline-template.entities";
import {PipelineTemplateProcessService} from "../pipeline-template-process.service";
import {Location} from "@angular/common";
import {ImageTemplateService} from "../image-template.service";

@Component({
  selector: 'pipeline-template-info',
  templateUrl: './pipeline-template-info.component.html',
  styles: [`
    pipeline-template-info .ant-form-item-label {
      margin-top: 4px !important;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [ImageTemplateService]
})
export class PipelineTemplateInfoComponent extends BaseFormComponent<PipelineTemplateInfo> {
  imageTemplates: { name: string, id: number }[] = [];

  @Output() next$ = new EventEmitter();

  constructor(private fb: FormBuilder,
              public location: Location,
              private ppService: PipelineTemplateProcessService,
              private imgService: ImageTemplateService) {
    super();
  }

  initForm(): FormGroup {
    return this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      isGenerateImage: [false, []],
      imageTemplateId: ['', []],
      isDeploy: [false, []]
    });
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.data = this.ppService.currTemplate;
    this.imgService.getAllTemplates().subscribe(res => {
      this.imageTemplates = res.rows;
    });
  }

  next() {
    this.submitForm();
    this.next$.emit();
  }

  get enableSubmit() {
    return this.getFormValue('name') && this.getFormValue('description');
  }
}
