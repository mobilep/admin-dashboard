import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mpw-section-toggle',
  templateUrl: './section-toggle.component.html',
  styleUrls: ['./section-toggle.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionToggleComponent {
  @Input() expandedText = '';
  @Input() collapsedText = '';
  @Input() isExpanded = false;
  @Output() toggle = new EventEmitter<void>();
}
