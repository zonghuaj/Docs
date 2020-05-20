import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
// --- DO NOT REMOVE NEXT 2 LINES, FOR CODE-MIRROR ---
import 'codemirror/mode/groovy/groovy';
import {PipelineTemplateProcessService} from "../pipeline-template-process.service";

@Component({
  selector: 'pipeline-template-code',
  templateUrl: './pipeline-template-code.component.html',
  styleUrls: ['./pipeline-template-code.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PipelineTemplateCodeComponent implements OnInit, AfterViewInit {
  @ViewChild('codeeditor') private codeEditor;

  option: any = {
    lineNumbers: true,
    mode: 'groovy',
    theme: 'material'
  };

  codes;

  @Output() prev$ = new EventEmitter();
  @Output() next$ = new EventEmitter();
  @Output() submit = new EventEmitter();

  constructor(private ppService: PipelineTemplateProcessService) {
  }

  ngOnInit(): void {
    this.codes = this.ppService.currTemplate.script;
  }

  ngAfterViewInit(): void {
    const editor = this.codeEditor.codeMirror;
    editor.setSize('100%', '100%');
  }

  next() {
    this.submit.emit(this.codes);
    this.next$.emit();
  }
}
