import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mpw-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  @Input() imgSrc = '';
  @Input() bg = '';
  @Input() firstName = '';
  @Input() lastName = '';
}
