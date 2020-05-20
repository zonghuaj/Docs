import {Component} from '@angular/core';

import {PIPELINE_TEMPLATE_CONSTANTS} from "../pipeline-template.entities";

@Component({
  selector: 'pipeline-constant-table',
  template: `
    <div style="height: 100%;">
      <p>注: 脚本中可以使用自定义参数变量{{'{{var_name}'}}}，在创建流水线时，会由用户输入模板规定的参数。</p>
      <nz-table #tb [nzData]="constants" nzBordered style="height: 100%;"
                [nzShowPagination]="false" [nzFrontPagination]="false">
        <thead>
        <tr>
          <th nzWidth="100px">参数名</th>
          <th nzWidth="100px">参数key</th>
          <th>描述</th>
        </tr>
        </thead>
        <tbody>
        <tr *ngFor="let d of tb.data">
          <td>{{ d.name }}</td>
          <td>{{ d.key }}</td>
          <td>{{ d.desc }}</td>
        </tr>
        </tbody>
      </nz-table>
    </div>
  `,
})
export class PipelineConstantTableComponent {
  readonly constants = PIPELINE_TEMPLATE_CONSTANTS;

  constructor() {
  }
}
