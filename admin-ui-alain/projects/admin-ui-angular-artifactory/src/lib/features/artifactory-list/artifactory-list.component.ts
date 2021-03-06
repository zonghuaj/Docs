import {
  Component, EventEmitter, Input,
  OnInit, Output,
} from '@angular/core';
import {Router} from "@angular/router";
import {ArtifactoryService} from "../artifactory.service";
import {ModalHelper} from "@delon/theme";
import {ArtifactoryCreateComponent} from "../artifactory-create/artifactory-create.component";
import {ArtifactoryEntity, ArtifactoryVersion} from "../artifactory.entities";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'artifactory-list',
  templateUrl: './artifactory-list.component.html',
  providers: [ArtifactoryService]
})
export class ArtifactoryListComponent implements OnInit {
  loading = false;
  totalCount: number;
  q: any = {
    pi: 1,
    ps: 10,
    name: '',
  };
  datas: ArtifactoryEntity[] = [];

  // this one is used to select artifactory version in - "从制品版本创建"
  @Output() itemSelect$ = new EventEmitter<{ artf: ArtifactoryEntity, ver: ArtifactoryVersion }>();
  @Input() simpleList = false;

  constructor(public router: Router,
              private modal: ModalHelper,
              private msg: NzMessageService,
              private artifService: ArtifactoryService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loading = true;
    const {pi, ps, name} = this.q;
    this.artifService.getAllArtifactorys(pi, ps, name).subscribe(res => {
      this.loading = false;
      this.totalCount = res.count;
      this.datas = res.rows.map((artf: ArtifactoryEntity) => {
        // push an empty version for table showing
        if (!artf.versions || artf.versions.length === 0) {
          artf.versions.push({
            lastVersion: '',
            flows: {stages: [], updateAt: artf.updateAt},
            lastTime: artf.updateAt,
            updateAt: artf.updateAt,
          } as ArtifactoryVersion);
        }

        return artf;
      });
    }, err => {
      this.loading = false;
      this.msg.error('列表获取失败');
    });
  }

  create() {
    this.modal.create(ArtifactoryCreateComponent, {}, {
      size: 'md',
      modalOptions: {
        nzTitle: '创建制品',
      }
    }).subscribe(res => {
      this.getData();
    });
  }

  toDetail(item: ArtifactoryVersion) {
    this.router.navigateByUrl(`/artifactory/${item.id}/info`);
  }

  getVersionStages(v) {
    try {
      return v.flows.stages;
    } catch (e) {
      return [];
    }
  }

  getLastTime(i) {
    try {
      if (i.flows && i.flows.updateAt) {
        return i.flows.updateAt;
      } else {
        return i.updateAt;
      }
    } catch (e) {
      return '';
    }
  }

  onItemClicked(artf, ver) {
    this.itemSelect$.emit({artf, ver});
  }

  onPageIndexChange(p) {
    this.q.pi = p;
    this.getData();
  }
}
