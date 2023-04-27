import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import { TemplateService } from 'services/template.service';

export interface Data {
  templateId: string;
  companyId: string;
}

@Component({
  selector: 'mpw-template-delete-dialog',
  templateUrl: './template-delete-dialog.component.html',
  styleUrls: ['./template-delete-dialog.component.sass']
})
export class TemplateDeleteDialogComponent {
  static config = {
    width: '350px',
    position: {
      top: '20px'
    }
  }

  constructor(
    private templateService: TemplateService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<TemplateDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) { }

  delete() {
    const {companyId, templateId} = this.data || {};

    if (companyId && templateId) {
      this.templateService.delete(companyId, templateId)
        .subscribe(() => {
          localStorage.setItem('notificationMessage', this.translate.instant('templates.successfullyDeleted'));
          this.close();
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
