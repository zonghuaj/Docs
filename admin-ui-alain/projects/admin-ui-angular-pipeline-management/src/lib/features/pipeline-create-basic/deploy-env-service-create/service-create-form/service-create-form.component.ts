import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseFormComponent, ServiceEntity} from "admin-ui-angular-common";
import {DESC_K8S_PLACEHOLDER, k8sNameFormValidor} from "admin-ui-angular-common";

@Component({
  selector: 'admin-ui-angular-service-create-form',
  templateUrl: './service-create-form.component.html',
  styles: []
})
export class ServiceCreateFormComponent extends BaseFormComponent<ServiceEntity> {
  readonly namePlaceHolder = DESC_K8S_PLACEHOLDER;

  constructor(private fb: FormBuilder) {
    super();
  }

  initForm(): FormGroup {
    return this.form = this.fb.group({
      serviceName: ['', [Validators.required, k8sNameFormValidor]],
      versionName: ['', [Validators.required, k8sNameFormValidor]],
      serviceDesc: ['', []],
      routerHost: ['NA', [Validators.required]],
      envCode: ['NA', [Validators.required]],
      routerPrefix: ['NA', []],
      appPorts: this.fb.array([this.createPort()])
    });
  }

  createPort() {
    return this.fb.group({
      protocol: 'http',
      port: '1',
    });
  }

  addPort() {
    this.appPorts.push(this.createPort());
  }

  removePort(i: number) {
    this.appPorts.removeAt(i);
  }

  portValidator(control: FormControl): any {
    const result = Number.parseInt(control.value);
    const valid = Number.isInteger(result) && result < 65535 && result > 0;
    return valid ? null : {appPort: ''};
  }

  get immutable() {
    return false;
  }

  get serviceName() {
    return this.form.controls.serviceName;
  }

  get versionName() {
    return this.form.controls.versionName;
  }

  get serviceDesc() {
    return this.form.controls.serviceDesc;
  }

  get routerHost() {
    return this.form.controls.routerHost;
  }

  get routerPrefix() {
    return this.form.controls.routerPrefix;
  }

  get appPorts() {
    return this.form.controls.appPorts as FormArray;
  }

  getPort(index) {
    return this.appPorts.controls[index]['controls'].port;
  }

  protected setFormData(d: ServiceEntity) {
    // add some count of rule controls
    if (this.appPorts.controls.length < d.appPorts.length) {
      for (let i = 0; i < d.appPorts.length - 1; i++) {
        this.addPort();
      }
    }
    super.setFormData(d);

    this.disableField(this.serviceName);
  }

  _submitForm(d: ServiceEntity): ServiceEntity {
    return {
      ...d,
      appPorts: d.appPorts.map(p => ({
        port: +p.port,
        protocol: p.protocol
      }))
    };
  }
}
