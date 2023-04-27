import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mpw-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() name: string;

  iconsPath = '/assets/icons/';
}
