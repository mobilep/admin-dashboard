import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// components
import { PlayerComponent } from '../player/player.component';

// models
import { ScenarioDetails, VideoObject } from '../../models/scenario-details';

@Component({
  selector: 'mpw-scenario-info',
  templateUrl: './scenario-info.component.html',
  styleUrls: ['./scenario-info.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScenarioInfoComponent {
  @Input() scenario: ScenarioDetails;

  constructor(private dialog: MatDialog) {}

  openVideo(video: VideoObject): void {
    this.dialog.open(PlayerComponent, {
      width: 'initial',
      height: '400px',
      data: video,
      position: {
        top: '20px'
      }
    });
  }

  round(duration: number): number {
    return Math.round(duration);
  }
}
