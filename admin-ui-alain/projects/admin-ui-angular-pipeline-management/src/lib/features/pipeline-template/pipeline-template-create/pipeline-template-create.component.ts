import {Component, OnInit} from '@angular/core';
import {PipelineTemplateProcessService} from "../pipeline-template-process.service";

@Component({
  selector: 'pipeline-template-create',
  templateUrl: './pipeline-template-create.component.html',
})
export class PipelineTemplateCreateComponent implements OnInit {
  step = 0;

  constructor(private ppService: PipelineTemplateProcessService) {
  }

  ngOnInit(): void {
    this.ppService.reset();
  }

  prevStep() {
    this.step--;
    if (this.step < 0) this.step = 0;
  }

  nextStep() {
    this.step++;
    if (this.step > 2) this.step = 2;
  }
}
