import { BaseFormComponent } from 'admin-ui-angular-common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GatewayConfigEntity, RouteConfigEntity, RouteMatchEntity, ServiceConfigEntity } from '../../entities/traffic-config.entites';

@Component({
  selector: 'traffic-service-panel-form',
  templateUrl: './service-traffic-panel-form.component.html',
  styleUrls: ['./service-traffic-panel-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceTrafficPanelFormComponent extends BaseFormComponent<ServiceConfigEntity> {
  @Input() gateways: GatewayConfigEntity[];

  @Input() service: any;

  @Input() traffic: any;

  private _allPorts = [];
  @Input() set allPorts(ps: any[]) {
    if (!ps) return;

    this._allPorts = ps.filter(p => p.protocol === 'http');
    this.setAppPorts();
  }

  get allPorts() {
    return this._allPorts;
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super();
  }

  initForm(): FormGroup {
    const fgroup = this.fb.group({
      gatewayEnable: [false, []],
      gateway: ['', []],
      domains: [null, []],
      appPorts: [0, []],
      prefix: ['/', []],
      corsEnable: [null, []],
      corsSource: [null, []],
      corsMethod: [null, []],
      corsHeader: [null, []],
      corsExpired: [null, []],
      grayEnable: [false, []],
      abTestEnable: [false, []],
      matchVersion: [null, []],
      matchKey: ['headers', []],
      matchHeader: ['', []],
      matchType: ['exact', []],
      matchVal: ['', []],
      rewrite: ['', []],
    });

    this.versions.forEach(v => {
      fgroup.addControl(`gray${v.name}`, new FormControl(''));
    });

    return fgroup;
  }

  protected setFormData(d: ServiceConfigEntity) {
    super.setFormData(d);
    this.setAppPorts();

    const cors = JSON.parse(<string>d.crossOrigin);
    const gray = JSON.parse(d.gray);
    const match = JSON.parse(d.match);
    try {
      this.parseMatches(match.data).forEach(r => this.addRule(r.vname, r.matches));
    } catch (e) {
    }

    const fval = {
      corsEnable: cors.enable,
      corsSource: cors.source,
      corsHeader: cors.header,
      corsMethod: cors.method,
      corsExpired: cors.expired,

      grayEnable: gray.enable,
      ...this.array2Object(gray.rates.map(r => {
        const k = Object.keys(r)[0];
        return { [`gray${k}`]: r[k] };
      })),

      abTestEnable: match.enable
    };
    this.setFormVal(fval);
  }

  setAppPorts() {
    if (this.data && this.data.appPorts) {
      this.setFormVal({ appPorts: this.data.appPorts });
    } else if (this.allPorts.length > 0) {
      this.setFormVal({ appPorts: +this.allPorts[0].port });
    }
  }

  parseMatches(matchData) {
    const rules: RouteConfigEntity[] = [];
    matchData.forEach(d => {
      const vname = d.route[0].destination.subset;
      const matches: RouteMatchEntity[] = [];

      d.match.forEach(mat => {
        for (const mk in mat) {
          const obj = mat[mk];

          if (mk === 'headers') {
            // {headers: {h1: {exact: "123"}, h2: {exact: "abc"}}}
            for (const h in obj) {
              const hdr = obj[h];
              const type = Object.keys(hdr)[0];
              matches.push({
                matchKey: mk,
                matchHeader: h,
                matchType: type,
                matchVal: hdr[type]
              });
            }
          } else { // {uri: {exact: "123"}}
            const type = Object.keys(obj)[0];
            matches.push({
              matchKey: mk,
              matchHeader: '',
              matchType: type,
              matchVal: obj[type]
            });
          }
        }
      });

      rules.push({ vname, matches });
    });

    return rules;
  }

  get domainVals() {
    try {
      const gwVal = this.getFormValue('gateway');
      const dms = this.gateways.find(gw => gw.name === gwVal);
      return JSON.parse(dms.domains);
    } catch (e) {
      return [];
    }
  }

  get versions() {
    return this.service.versions;
  }

  get corsEnable() {
    return this.getFormValue('corsEnable');
  }

  get matchVersion() {
    return this.getFormValue('matchVersion');
  }

  get matchKey() {
    return this.getFormValue('matchKey');
  }

  get matchHeader() {
    return this.getFormValue('matchHeader');
  }

  get matchType() {
    return this.getFormValue('matchType');
  }

  get matchVal() {
    return this.getFormValue('matchVal');
  }

  get rates() {
    return this.versions.map(v => ({
      [v.name]: this.getFormValue(`gray${v.name}`)
    }));
  }

  get appPorts() {
    return this.getFormValue('appPorts');
  }

  matches: RouteMatchEntity[] = [];

  addMatch() {
    const { matchKey, matchHeader, matchType, matchVal } = this;
    this.matches.push({ matchKey, matchHeader, matchType, matchVal });
    this.cdr.detectChanges();
  }

  removeMatch(i) {
    this.matches.splice(i, 1);
    this.cdr.detectChanges();
  }

  formatMatch(m: RouteMatchEntity) {
    return m.matchKey === 'headers' ?
      `header[${m.matchHeader}] ${m.matchType} ${m.matchVal}` :
      `${m.matchKey} ${m.matchType} ${m.matchVal}`;
  }

  rules: RouteConfigEntity[] = [];

  addRule(vname, mths) {
    const matches = [...mths];
    this.rules.push({ vname, matches });
    this.matches = [];
    this.cdr.detectChanges();
  }

  matchTypeChanged() {
    this.setFormVal({ matchHeader: '' });
    this.cdr.detectChanges();
  }

  removeRule(i) {
    this.rules.splice(i, 1);
    this.cdr.detectChanges();
  }

  _submitForm(d: ServiceConfigEntity): ServiceConfigEntity {
    const newD = { ...d };
    newD.crossOrigin = {
      "enable": !!this.getFormValue('corsEnable'),
      "source": this.getFormValue('corsSource'),
      "header": this.getFormValue('corsHeader'),
      "method": this.getFormValue('corsMethod'),
      "expired": this.getFormValue('corsExpired'),
    };

    const rates = this.versions.map(v => ({
      [v.name]: this.getFormValue(`gray${v.name}`)
    }));
    newD.gray = {
      enable: this.getFormValue('grayEnable'),
      rates
    };

    const rules = this.rules.map(r => ({
      match: this.combineMatches(r.matches),
      route: [{
        destination: {
          host: this.service.name,
          subset: r.vname
        }
      }]
    }));
    newD.match = {
      enable: this.getFormValue('abTestEnable'),
      data: rules
    };

    delete newD['matchHeader'];
    delete newD['matchKey'];
    delete newD['matchType'];
    delete newD['matchVal'];
    delete newD['matchVersion'];
    delete newD['corsEnable'];
    delete newD['corsExpired'];
    delete newD['corsHeader'];
    delete newD['corsMethod'];
    delete newD['corsSource'];
    delete newD['grayEnable'];
    delete newD['abTestEnable'];
    this.versions.map(v => v.name).forEach(vn => {
      delete newD[`gray${vn}`]
    });

    return newD;
  }

  combineMatches(matches: RouteMatchEntity[]) {
    let ret = {};

    ['headers', 'uri', 'scheme', 'method', 'authority'].forEach(kwd => {
      const val = this.array2Object(matches.filter(m => m.matchKey === kwd).map(this.getMatchInnerItem))
      if (kwd === 'headers' && Object.keys(val).length > 0) {
        ret['headers'] = val;
      } else {
        ret = { ...ret, ...val };
      }
    });

    return [ret];
  }

  getMatchInnerItem(m: RouteMatchEntity) {
    const matchVal = { [m.matchType]: m.matchVal };
    return m.matchKey === 'headers' ? { [m.matchHeader]: matchVal } : { [m.matchKey]: matchVal };
  }

  array2Object(arr: any[]): object {
    return arr.reduce((acc, cur) => ({ ...acc, ...cur }), {});
  }

  onRateChanged(index, val) {
    const sum = this.versions.reduce((acc, cur) => {
      acc += +this.getFormValue(`gray${cur.name}`);
      return acc;
    }, 0);

    if (sum > 100) {
      const rest = Math.abs(val - 100) / (this.versions.length - 1);

      const newVals = {};
      this.versions.forEach((v, i) => {
        if (i !== index) {
          newVals[`gray${v.name}`] = rest;
        }
      });
      this.setFormVal(newVals);
    }
  }
}
