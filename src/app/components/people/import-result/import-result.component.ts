import { Component, Inject } from '@angular/core';
// vendor
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mpw-import-result',
  templateUrl: './import-result.component.html',
  styleUrls: ['./import-result.component.sass']
})
export class ImportResultComponent {
  public displayedColumnsFailed = ['lineNumber', 'email', 'failReason'];
  public displayedColumnsIssues = ['lineNumber', 'email', 'issues'];

  constructor(public dialogRef: MatDialogRef<ImportResultComponent>, @Inject(MAT_DIALOG_DATA) public result: any) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
