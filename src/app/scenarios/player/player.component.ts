import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mpw-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.sass']
})
export class PlayerComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public video: any,
    public dialog: MatDialog
  ) { }

  closeDialog() {
    this.dialog.closeAll();
  }
}
