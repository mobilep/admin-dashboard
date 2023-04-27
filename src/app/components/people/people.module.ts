import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// modules
import { PeopleRoutingModule } from './people-routing.module';
import { SharedModule } from '../../shared/shared.module';

// pipes
import { LimitToPipe } from '../../pipes/limit-to.pipe';
import { TrimPipe } from '../../pipes/trim.pipe';
import { PeopleFilterPipe } from './pipes/people-filter.pipe';

// components
import { PeopleComponent } from './people.component';
import { PeopleFormComponent } from './people-form/people-form.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleTableComponent } from './people-table/people-table.component';
import { PeopleFiltersComponent } from './people-filters/people-filters.component';
import { SendScenarioModule } from '../../scenarios/send-scenario/send-scenario.module';

@NgModule({
  imports: [
    CommonModule,
    PeopleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatMenuModule,
    MatProgressBarModule,
    SendScenarioModule
  ],
  declarations: [
    LimitToPipe,
    TrimPipe,
    PeopleComponent,
    PeopleFormComponent,
    PeopleListComponent,
    PeopleTableComponent,
    PeopleFiltersComponent,
    PeopleFilterPipe
  ]
})
export class PeopleModule {}
