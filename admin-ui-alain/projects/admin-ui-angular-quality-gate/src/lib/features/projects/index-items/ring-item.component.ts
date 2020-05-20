import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'qgate-check-item-ring',
  template: `
    <svg class="donut-chart" [attr.height]="height" [attr.width]="width">
      <g transform="translate(0, 0)">
        <g [attr.transform]="'translate( ' + width / 2 + ', ' + height / 2 + ')'">
          <path [attr.d]=[dvalue] stroke="#00AA00" [attr.stroke-width]="strokeWidth" fill="none"></path>
          <path [attr.d]=[dfill] stroke="#D4333F" [attr.stroke-width]="strokeWidth" fill="none"></path>
        </g>
      </g>
    </svg>
  `,
  styleUrls: [],
})
export class QGateCheckItemRingComponent implements OnInit {
  @Input() max = 100;
  @Input() value;

  @Input() type: 'sign' | 'sm' | 'lg' = 'sm';
  dvalue;
  dfill;

  height;
  width;
  radius;
  strokeWidth;

  constructor() {
  }

  ngOnInit(): void {
    if (this.type === 'sm') {
      this.height = 20;
      this.width = 20;
      this.radius = 8;
      this.strokeWidth = 2;
    } else if (this.type === 'lg') {
      this.height = 56;
      this.width = 56;
      this.radius = 24;
      this.strokeWidth = 4;
    } else if (this.type === 'sign') {
      this.height = 16;
      this.width = 16;
      this.radius = 7;
      this.strokeWidth = 2;
    }

    const dgree = this.value / this.max * 360;
    this.dvalue = describeArc(0, 0, this.radius, 0, dgree);
    this.dfill = describeArc(0, 0, this.radius, dgree, 359.9);
  }
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}
