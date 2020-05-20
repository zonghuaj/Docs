import {animate, state, style, transition, trigger} from "@angular/animations";

export const FadingAnim = trigger('Fade', [
  state('void', style({opacity: 0})),
  state('*', style({opacity: 1})),
  transition(':enter', animate('150ms ease-out')),
  transition(':leave', animate('150ms ease-in')),
]);
