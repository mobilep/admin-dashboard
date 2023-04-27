import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mpw-user-with-avatar',
  templateUrl: './user-with-avatar.component.html',
  styleUrls: ['./user-with-avatar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserWithAvatarComponent {
  @Input() avaSrc = '';
  @Input() avaBg = '';
  @Input() firstName = '';
  @Input() lastName = '';
}
