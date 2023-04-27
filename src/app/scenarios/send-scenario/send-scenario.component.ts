import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialogConfig } from '@angular/material/dialog/dialog-config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { UserService } from 'services/user.service';
import { TemplateService } from 'services/template.service';

import { TranslateService } from '@ngx-translate/core';
import { Template } from 'models/template';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from '../template-create/validators';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MATCHER } from '../../utils/matcher';

export interface Data {
  companyId: string;
  userIds: string[];
}
export interface Result {
  selected: Template[];
}


@Component({
  selector: 'mpw-send-scenario',
  templateUrl: './send-scenario.component.html',
  styleUrls: ['./send-scenario.component.sass']
})
export class SendScenarioComponent implements OnInit {
  static config: MatDialogConfig = {width: '440px', disableClose: true};

  form: FormGroup;
  filteredItems$: Observable<Template[]>;
  sending: boolean;

  constructor(
    public dialogRef: MatDialogRef<SendScenarioComponent>,
    private userService: UserService,
    private templateService: TemplateService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    this.sending = false;
    this.form = new FormGroup({
      name: new FormControl(''),
      selected: new FormControl([], CustomValidators.ArrayValidators.minLength(1))
    });
    this.filteredItems$ = combineLatest([
      templateService.data$,
      this.form.get('name').valueChanges.pipe(startWith('')),
      this.form.get('selected').valueChanges.pipe(startWith([]))
    ]).pipe(
      map(([items, query, selected]) =>
        items.filter(item => MATCHER.stringMatch(query, item.name) && !selected.includes(item))
      ),
    );
  }

  ngOnInit() {
    this.templateService.loadTemplatesByCompany(this.data.companyId)
      .subscribe();
  }

  onSubmit() {
    if (!this.sending && this.form.valid) {
      const assignCoachesToTemplates = this.selected.map(template => this.templateService.assignCoach({
        companyId: this.data.companyId,
        userIds: this.data.userIds,
        templateId: template._id
      }));
      combineLatest(assignCoachesToTemplates).subscribe(() => {
        localStorage.setItem('notificationMessage', this.translate.instant('sendScenarioDialog.scenarioSuccessfullySent'));
        this.dialogRef.close({selected: this.selected} as Result);
        this.sending = false;
      })
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  select(item: Template): void {
    this.form.patchValue({selected: this.selected.concat(item), name: ''})
  }

  deselectItem(itemToDeselect: Template): void {
    this.form.patchValue({selected: this.selected.filter(item => item !== itemToDeselect), name: ''})
  }

  get selected(): Template[] {
    return this.form.get('selected').value;
  }

  get submitBtnText(): string {
    const selectedLength = this.selected.length;
    if (!selectedLength) {
      return this.translate.instant('send');
    } else if (selectedLength === 1) {
      return this.translate.instant('sendScenarioDialog.sendScenario');
    } else {
      return this.translate.instant('sendScenarioDialog.sendScenarioPlural', { number: selectedLength });
    }
  }
}
