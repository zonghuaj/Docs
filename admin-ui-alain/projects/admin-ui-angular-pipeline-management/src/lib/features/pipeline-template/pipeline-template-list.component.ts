import {Component, OnInit} from '@angular/core';

import {STChange, STColumn} from "@delon/abc";
import {Router} from "@angular/router";
import {PipelineTemplateService} from "./pipeline-template.service";

@Component({
  selector: 'pipeline-template-list',
  templateUrl: './pipeline-template-list.component.html',
  providers: [PipelineTemplateService]
})
export class PipelineTemplateListComponent implements OnInit {
  loading = false;
  totalCount: number;
  q: any = {
    pi: 1,
    ps: 10,
    name: '',
    isGenerateImage: '',
    // isDeploy: '',
  };
  datas: any[] = [];

  readonly columns: STColumn[] = [
    {title: '模板名称', index: 'name', width: 100},
    {title: '描述', index: 'description', width: 400},
    {title: '是否构建镜像', index: 'isGenerateImage', format: (item, col) => item.isGenerateImage ? '是' : '否'},
    // {title: '是否部署', index: 'isDeploy', format: (item, col) => item.isDeploy ? '是' : '否'},
    {title: '操作', render: 'operations'},
  ];

  constructor(public router: Router,
              private ptService: PipelineTemplateService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loading = true;
    let {pi, ps, name, isGenerateImage} = this.q;
    if (isGenerateImage === null) isGenerateImage = '';
    // if (isDeploy === null) isDeploy = '';
    this.ptService.getAllTemplates(pi, ps, name, isGenerateImage)
      .subscribe((res: any) => {
        this.loading = false;
        this.totalCount = res.count;
        this.datas = res.rows;
      });
  }

  stChange(e: STChange) {
    if (e.type === 'pi') {
      this.q.pi = e.pi;
      this.getData();
    }
  }

  duplicate(item) {

  }
}
