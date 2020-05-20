import {Component, ViewEncapsulation} from '@angular/core';
import {BaseFormComponent, FadingAnim} from "admin-ui-angular-common";
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TitleService} from "@delon/theme";

@Component({
  selector: 'artifactory-deployparams-form',
  templateUrl: './artifactory-detail-deployparams-form.component.html',
  styleUrls: ['./artifactory-detail-deployparams-form.component.less'],
  animations: [FadingAnim],
  encapsulation: ViewEncapsulation.None
})
export class ArtifactoryDetailDeployparamsFormComponent extends BaseFormComponent<any> {
  CPU_VALS = [
    {label: '0.5核', value: 0.5},
    {label: '1核', value: 1},
    {label: '1.5核', value: 1.5},
    {label: '2核', value: 2},
  ];

  MEM_VALS = [
    {label: '0.5GiB', value: 512},
    {label: '1GiB', value: 1024},
    {label: '1.5GiB', value: 1536},
    {label: '2GiB', value: 2048},
    {label: '3GiB', value: 3072},
  ];

  mountTypes = [
    {label: 'ReadWriteOnce', value: 'ReadWriteOnce'},
    {label: 'ReadOnlyMany', value: 'ReadOnlyMany'},
    {label: 'ReadWriteMany', value: 'ReadWriteMany'}
  ];

  FS_VALS = [
    {label: '128MiB', value: 128},
    {label: '512MiB', value: 512},
    {label: '1024MiB', value: 1024},
    {label: '1536MiB', value: 1536},
    {label: '2046MiB', value: 2046}
  ];

  constructor(private fb: FormBuilder,
              private titleSrv: TitleService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.titleSrv.setTitle('制品详情');
  }

  initForm(): FormGroup {
    return this.form = this.fb.group({
      cpu: [0.5, [Validators.required]],
      memory: [1024, [Validators.required]],
      volumePath: ['', []],
      volumeType: ['ReadWriteOnce', []],
      volumeMax: [128, []],
      healthMethod: ['get', []],
      healthPath: ['', [Validators.required]],
      ports: this.fb.array([]),
    });
  }

  // make sure this data set for only once
  private setOnce = true;

  protected setFormData(d: any) {
    if (!this.setOnce) return;

    if (this.ports.length < d.ports.length) {
      const diff = d.ports.length - this.ports.length;
      for (let i = 0; i < diff; i++) {
        this.addPort();
      }
    }

    super.setFormData(d);
  }

  addPort() {
    this.ports.push(this.createPort());
  }

  delPort(i) {
    this.ports.removeAt(i);
  }

  createPort() {
    return this.fb.group({
      type: ['http'],
      number: ['']
    });
  }

  get volumePath() {
    return this.form.controls.volumePath;
  }

  get healthPath() {
    return this.form.controls.healthPath;
  }

  get ports() {
    return this.form.controls['ports'] as FormArray;
  }
}
