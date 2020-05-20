import {
  Component,
  Input,
  ElementRef,
  ViewChild, AfterViewChecked, OnChanges, SimpleChanges,
} from '@angular/core';
import {Log} from '../log.entities';

@Component({
  selector: 'log-console',
  templateUrl: './log-console.component.html',
  styleUrls: ['./log-console.component.less']
})
export class LogConsoleComponent implements AfterViewChecked, OnChanges {
  @Input() logs: Log[] = [];
  @Input() scroll: boolean = true;

  @ViewChild('container') private containerEl: ElementRef;

  dataChanged = false;

  constructor() {
  }

  ngAfterViewChecked(): void {
    const d = new Date();
    if (this.scroll && this.dataChanged && this.logs.length > 0) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    try {
      this.containerEl.nativeElement.scrollTop = this.containerEl.nativeElement.scrollHeight;
      this.dataChanged = false;
    } catch (err) {
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataChanged = !!changes;
  }
}
