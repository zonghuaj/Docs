import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'qg-sign-rating',
  template: `
    <span class="rating" [ngClass]="{
          'rating-A': lvl === 'A',
          'rating-B': lvl === 'B',
          'rating-C': lvl === 'C',
          'rating-D': lvl === 'D',
          'rating-E': lvl === 'E'
        }">{{lvl}}</span>
  `,
  styleUrls: ['./rating-item.component.less'],
})
export class QGateCheckItemRatingComponent {

  @Input() lvl;

  constructor() {
  }
}

