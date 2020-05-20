import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'trace-span-detail',
  templateUrl: './trace-span-detail.component.html',
  styleUrls: ['./trace-span-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceSpanDetailComponent implements OnChanges {
  @Input() currentSpan;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentSpan'] && changes['currentSpan'].currentValue) {
      console.log(JSON.stringify(changes['currentSpan'].currentValue));
    }
    this.cdr.detectChanges();
  }
}
