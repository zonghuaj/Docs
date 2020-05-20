import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {PlatformManageService} from "./platform-manage.service";
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {CacheService} from "@delon/cache";
import {NzMessageService} from "ng-zorro-antd";
import {Location} from "@angular/common";
import {DockerfileEntity, ProjectEntity} from "./platform.entities";

@Component({
  selector: 'operatingEnv-management',
  templateUrl: './operatingEnv-management.component.html',
  styleUrls: ['./operatingEnv-management.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlatformManageService]
})
export class OperatingEnvManagementComponent implements OnInit, OnDestroy {

  isAddDockerfileVisible = false;
  isEditDockerfileVisible = false;
  project: ProjectEntity = new ProjectEntity();
  listOfDockerfile: any[] = [];
  dockerEditCache: { [key: string]: any } = {};
  updateDocker: any = {
    id: "",
    projectType: "",
    content: "",
    createDate: "",
    createBy: "",
    updateBy: "",
    updateDate: "",
    projectCode: "",
    tenantCode: ""
  };
  editId = "";
  loading = false;
  projectType: string;
  content: string;
  q: any = {
    pi: 1,
    ps: 10,
    statusIndex: 0,
    projectType: '',
  };

  constructor(
    private platformManageService: PlatformManageService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private cache: CacheService,
    private msg: NzMessageService,
    private location: Location,
    private fb: FormBuilder,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.getData();
  }


  startDockerEdit(id: any): void {
    // this.dockerEditCache[id].edit = true;
    this.isEditDockerfileVisible = true;
    this.updateDocker = {...id};
    this.editId = id;
    this.cdr.detectChanges();
  }

  cancelDockerfileEdit(id: string): void {
    const index = this.listOfDockerfile.findIndex(item => item.dockerfileId === id);
    this.dockerEditCache[id] = {
      data: {...this.listOfDockerfile[index]},
      edit: false
    };
  }

  submitFilter() {
    this.loading = true;
    this.getData();
  }

  updateEditCache(): void {
    this.listOfDockerfile.forEach(item => {
      this.dockerEditCache[item.dockerfileId] = {
        edit: false,
        data: {...item}
      };
      this.editId = item.dockerfileId;
    });
    this.loading = false;
  }

  saveDockerEdit(): void {
    // const index = this.listOfDockerfile.findIndex(item => item.dockerfileId === id);
    // Object.assign(this.listOfDockerfile[index], this.dockerEditCache[id].data);
    let de: DockerfileEntity = {...this.updateDocker}
    this.platformManageService.putDockerfiles(de)
      .subscribe(res => {
        this.msg.success('更新成功');
        this.location.forward();
        this.getData();
        this.cdr.detectChanges();
      }, (err) => {
        this.loading = false;
        this.msg.error('更新失败');
        this.cdr.detectChanges();
      });
    this.isEditDockerfileVisible = false;
  }

  delDockerfileData(id: string): void {
    const index = this.listOfDockerfile.findIndex(item => item.dockerfileId === id);
    this.platformManageService.delDockerfiles(this.listOfDockerfile[index].dockerfileId).subscribe(res => {
      this.msg.success('删除成功');
      this.location.forward();
      this.getData();
      this.cdr.detectChanges();
    }, (err) => {
      this.loading = false;
      this.msg.error('存在服务正在使用该文件,无法删除!');
      this.cdr.detectChanges();
    });
  }


  getData() {
    // this.loading = true;
    const {pi, ps, projectType} = this.q;
    this.platformManageService.getDockerfiles(pi, ps, projectType).subscribe((res: any) => {
      // 1. set data
      this.listOfDockerfile = [...res.rows];
      // 2. update dockerEditCache
      this.updateEditCache();
      // 3. detect changes
      this.cdr.detectChanges();
    });
  }

  showDockerfileModal(): void {
    this.isAddDockerfileVisible = true;
  }

  createDockerTpl(): void {
    let dockerEn: DockerfileEntity = new DockerfileEntity();
    dockerEn.projectType = this.projectType;
    dockerEn.content = this.content;
    dockerEn.projectCode = this.cache.getNone('projectCode');
    dockerEn.tenantCode = this.cache.getNone('tenantId');
    this.platformManageService.postDockerfiles(dockerEn).subscribe(res => {
      this.msg.success('创建成功');
      this.location.forward();
      this.getData();
      this.cdr.detectChanges();
    }, (err) => {
      this.loading = false;
      this.msg.error('创建成功');
      this.cdr.detectChanges();
    });
    this.isAddDockerfileVisible = false;
    this.projectType = null;
    this.content = null;

  }

  addhandleDockerCancel(): void {
    this.isAddDockerfileVisible = false;
    this.projectType = null;
    this.content = null;
  }

  edithandleDockerCancel(): void {
    this.isEditDockerfileVisible = false;
  }
}
