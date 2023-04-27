import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SendScenarioComponent } from './send-scenario.component';



@NgModule({
  declarations: [
    SendScenarioComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    CommonModule,
    MatAutocompleteModule,
    SharedModule
  ],
  exports: [
    SendScenarioComponent,
  ]
})
export class SendScenarioModule { }
