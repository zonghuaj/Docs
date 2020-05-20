import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, Input, OnChanges,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';

import * as d3 from 'd3';
import Tree from './d3-trace-tree';

@Component({
  selector: 'trace-tree-view',
  templateUrl: './trace-tree-view.component.html',
  styleUrls: ['./trace-tree-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraceTreeViewComponent implements OnChanges {
  @ViewChild('container') containerEl: ElementRef;

  tree: any;
  segmentId: any[];

  list: any;

  @Output() detailClick$: EventEmitter<any> = new EventEmitter<any>();

  @Input() data: any;
  @Input() traceId: any;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['traceId']) {
      this.draw();
    }
  }

  draw() {
    this.changeTree();

    this.tree = new Tree(this.containerEl.nativeElement, this);
    this.tree.init({label: `${this.traceId}`, children: this.segmentId}, this.data);
  }

  changeTree() {
    if (this.data.length === 0) return [];
    this.list = Array.from(new Set(this.data.map(i => i.serviceCode)));
    this.segmentId = [];
    const segmentGroup = [];
    const segmentIdGroup = [];
    this.data.forEach(i => {
      i.label = i.endpointName || 'no operation name';
      i.children = [];
      if (segmentGroup[i.segmentId] === undefined) {
        segmentIdGroup.push(i.segmentId);
        segmentGroup[i.segmentId] = [];
        segmentGroup[i.segmentId].push(i);
      } else {
        segmentGroup[i.segmentId].push(i);
      }
    });
    segmentIdGroup.forEach(id => {
      const currentSegment = segmentGroup[id].sort((a, b) => b.parentSpanId - a.parentSpanId);
      currentSegment.forEach(s => {
        const index = currentSegment.findIndex(i => i.spanId === s.parentSpanId);
        if (index !== -1) {
          currentSegment[index].children.push(s);
          currentSegment[index].children.sort((a, b) => a.spanId - b.spanId);
        }
      });
      segmentGroup[id] = currentSegment[currentSegment.length - 1]
    });
    segmentIdGroup.forEach(id => {
      segmentGroup[id].refs.forEach(ref => {
        if (ref.traceId === this.traceId) {
          this.traverseTree(segmentGroup[ref.parentSegmentId], ref.parentSpanId, ref.parentSegmentId, segmentGroup[id])
        }
      });
      // if(segmentGroup[id].refs.length !==0 ) delete segmentGroup[id];
    });
    for (const i in segmentGroup) {
      if (segmentGroup[i].refs.length === 0)
        this.segmentId.push(segmentGroup[i]);
    }
    this.segmentId.forEach((_, i) => {
      this.collapse(this.segmentId[i]);
    });
  }

  traverseTree(node, spanId, segmentId, data) {
    if (!node) return;
    if (node.spanId == spanId && node.segmentId == segmentId) {
      node.children.push(data);
      return;
    }
    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        this.traverseTree(node.children[i], spanId, segmentId, data);
      }
    }
  }

  collapse(d) {
    if (d.children) {
      let dur = d.endTime - d.startTime;
      d.children.forEach(i => {
        dur -= (i.endTime - i.startTime);
      });
      d.dur = dur < 0 ? 0 : dur;
      d.children.forEach((i) => this.collapse(i));
    }
  }

  computedScale(i) {
    const sequentialScale = d3.scaleSequential()
      .domain([0, this.list.length + 1])
      .interpolator(d3.interpolateCool);
    return sequentialScale(i);
  }

  handleSelectSpan(i) {
    this.detailClick$.emit(i.data);
  }
}
