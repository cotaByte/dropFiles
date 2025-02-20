import { animate, style, transition, trigger } from '@angular/animations';

export const VERTICAL_EXPAND = trigger('expandVertical', [
  transition(':enter', [
    style({ height: '0' }),
    animate('0.35s ease-in', style({ heigth: '100%' })),
  ]),
  transition(':leave', [
    style({ heigth: '100%' }),
    animate('0.35s ease-out', style({ heigth: '0' })),
  ]),
]);
