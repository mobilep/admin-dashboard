import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { MatDialogConfig } from '@angular/material/dialog/dialog-config';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { User } from 'models/user';

import { UserService } from 'services/user.service';
import { TemplateService } from 'services/template.service';

import { CustomValidators } from '../template-create/validators';
import { TranslateService } from '@ngx-translate/core';

export interface Data {
  templateId: string;
  companyId: string;
}

@Component({
  selector: 'mpw-assign-coach',
  templateUrl: './assign-coach.component.html',
  styleUrls: ['./assign-coach.component.sass']
})
export class AssignCoachComponent implements OnInit, OnDestroy {
  static config: MatDialogConfig = {width: '440px', disableClose: true};

  filteredUsers: User[];
  assignCoachForm: FormGroup;

  private onDestroy$: Subject<void>;
  private sending: boolean;

  constructor(
    public dialogRef: MatDialogRef<AssignCoachComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private templateService: TemplateService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Data
  ) {
    this.onDestroy$ = new Subject<void>();
    this.assignCoachForm = new FormGroup({
      name: new FormControl(''),
      users: new FormControl([], CustomValidators.ArrayValidators.minLength(1))
    })

    this.sending = false;
  }

  ngOnInit() {
      this.setFilteredUsers();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  setFilteredUsers(): void {
    combineLatest([
      this.userService.getUsersInCompany(this.data.companyId),
      this.assignCoachForm.get('name').valueChanges.pipe(startWith('')),
      this.assignCoachForm.get('users').valueChanges.pipe(startWith([]))
    ]).pipe(
      map(([users, query, selectedUsers]) => users
        .filter(user => user.name.toLowerCase().includes(query.toLowerCase()) && !selectedUsers.includes(user))
      ),
      takeUntil(this.onDestroy$)
    ).subscribe(users => this.filteredUsers = users);
  }

  addUser(user: User): void {
    const users = this.assignCoachForm.get('users').value;

    this.assignCoachForm.patchValue({users: users.concat(user), name: ''})
  }

  removeUser(userToRemove: User): void {
    const users = this.assignCoachForm.get('users').value;

    this.assignCoachForm.patchValue({users: users.filter(user => user !== userToRemove), name: ''})
  }

  sendScenario() {
    if (!this.sending && this.assignCoachForm.valid) {
      this.templateService
        .assignCoach({companyId: this.data.companyId, templateId: this.data.templateId, userIds: this.users.map(user => user._id)})
        .subscribe(() => {
          localStorage.setItem('notificationMessage', this.translate.instant('assignCoach.scenarioSuccessfullySent'));
          this.dialogRef.close();
          this.sending = false
        })
    }
  }

  close() {
    this.dialogRef.close();
  }

  get users() {
    return this.assignCoachForm.get('users').value;
  }
}
