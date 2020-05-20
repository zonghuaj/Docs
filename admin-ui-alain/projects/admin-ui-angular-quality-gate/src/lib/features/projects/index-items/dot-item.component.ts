import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'qgate-check-item-dot',
  template: `
    <svg class="donut-chart" [attr.height]="height" [attr.width]="width">
      <g transform="translate(0, 0)">
        <g [attr.transform]="'translate( ' + width / 2 + ', ' + height / 2 + ')'">
          <path [attr.d]=[bgd] [attr.stroke]="color" [attr.stroke-width]="strokeWidth" fill="none"
                shape-rendering="optimizeQuality"></path>
          <path [attr.d]=[d] [attr.fill]="color"
                shape-rendering="optimizeQuality"></path>
        </g>
      </g>
    </svg>
  `,
  styleUrls: [],
})
export class QGateCheckItemDotComponent implements OnInit {
  @Input() lvl;
  @Input() type: 'sign' | 'sm' | 'lg' = 'sm';

  bgd;
  d;
  color;

  height;
  width;
  radius;
  radiusInnr;
  strokeWidth;

  constructor() {
  }

  ngOnInit(): void {
    if (this.type === 'sm') {
      this.height = 20;
      this.width = 20;
      this.radius = 8;
      this.strokeWidth = 2;
      this.radiusInnr = [0, 1.5, 3, 4, 6];
    } else if (this.type === 'lg') {
      this.height = 56;
      this.width = 56;
      this.radius = 24;
      this.strokeWidth = 4;
      this.radiusInnr = [0, 5, 7.5, 12.5, 20];
    } else if (this.type === 'sign') {
      this.height = 16;
      this.width = 16;
      this.radius = 6;
      this.strokeWidth = 2;
      this.radiusInnr = [0, 1, 2, 3, 4.5];
    }

    this.bgd = describeArc(0, 0, this.radius, 0, 359.9);

    const {lvl} = this;
    let rInner = 0;
    switch (lvl) {
      case 1:
        this.color = '#00aa00';
        rInner = this.radiusInnr[0];
        break;
      case 2:
        this.color = '#b0d513';
        rInner = this.radiusInnr[1];
        break;
      case 3:
        this.color = '#eabe06';
        rInner = this.radiusInnr[2];
        break;
      case 4:
        this.color = '#ed7d20';
        rInner = this.radiusInnr[3];
        break;
      case 5:
        this.color = '#d4333f';
        rInner = this.radiusInnr[4];
        break;
    }
    this.d = describeArc(0, 0, rInner, 0, 359.9);
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
