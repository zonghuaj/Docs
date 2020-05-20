import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ZGContainer, ZGData, ZGText } from '../zgrafna.entites';
import { ZGrafnaService } from '../zgrafna.service';

@Component({
  selector: 'zgrafna-container',
  template: `
    <div class="panel">
      <span class="loading" *ngIf="loading"><i nz-icon nzType="loading" nzTheme="outline"></i></span>
      <div class="title noselect">{{title}}
      </div>
      <div class="pilot" [style.height]="pHeight">
        <zgrafna-schart *ngIf="sac.chart"
                        [data]="mData"
                        [chartOpt]="sac.chart"
                        [unit]="sac.unit"></zgrafna-schart>
        <zgrafna-single-stat *ngIf="sac.text"
                             [data]="mData"
                             [saText]="sac.text"
                             [unit]="sac.unit"></zgrafna-single-stat>
        <div class="error noselect" *ngIf="error">ERROR</div>
        <div class="nodata noselect" *ngIf="nodata">NO DATA</div>
      </div>
    </div>
  `,
  styleUrls: ['./zgrafna-container.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ZGrafnaService]
})
export class ZGrafnaContainerComponent implements OnInit, OnDestroy {
  _sac: ZGContainer;
  @Input() set sac(s: ZGContainer) {
    if (!s) return;

    this._sac = s;
    this.setAttrs();
    this.reset();
    this.requestData();
  };

  get sac() {
    return this._sac;
  }

  pHeight = '200px';

  mData: ZGData[];

  title: string;
  textOption: ZGText;

  loading = false;
  error = false;
  nodata = false;

  constructor(
    private grafnaService: ZGrafnaService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  setAttrs() {
    this.title = this.sac.title;
    this.pHeight = this.sac.height;
    this.cdr.detectChanges();
  }

  reset() {
    if (this.textOption) {
      this.textOption = null;
    }
    this.cdr.detectChanges();
  }

  requestData() {
    const requests = this.sac.sources
      .filter(s => !!s.qstring)
      .map(s => this.grafnaService.requestData(s.qstring, this.sac.times));

    if (requests.length > 0) {
      this.loading = true;
      this.cdr.detectChanges();
      zip(...requests)
        .pipe(mergeMap(arr => of(arr.map(a => a.data.result))))
        .subscribe((res: any[]) => {
          this.loading = false;
          // add given options to each -> insider items
          this.mData = res.map((rs, idx) => {
            const sourceOpt = this.sac.sources[idx].opt;
            return rs.map(r => ({
              ...r,
              opt: sourceOpt
            }));
          }).reduce((p, c) => [...p, ...c]);

          this.nodata = this.mData.length === 0;

          this.cdr.detectChanges();
        }, err => {
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        });
    } else if (this.sac._val) {
      this.mData = [{ values: [[0, this.sac._val]] }];
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }
}
