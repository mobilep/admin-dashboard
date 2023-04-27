import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Vendors
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Pipes
import { LimitPipe } from './pipes/limit.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { ScenariosFilterPipe } from './pipes/scenarios-filter.pipe';
import { TimePipe } from './pipes/time.pipe';
import { LearnersFilterPipe } from './pipes/learners-filter.pipe';
import { DaysDistancePipe } from '../metrics/pipes/days-distance.pipe';
import { FormatSecondsWithMinutesPipe } from './pipes/format-seconds-with-minutes.pipe';
import { BytesToMbPipe } from './pipes/bytes-to-mb.pipe';

// Modules
import { ScenariosRoutingModule } from './scenarios-routing.module';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgBufferingModule } from 'videogular2/compiled/buffering';
import { VgStreamingModule } from 'videogular2/compiled/streaming';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { SharedModule } from '../shared/shared.module';

// Components
import { ScenariosComponent } from './scenarios.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ChatComponent } from './chat/chat.component';
import { PlayerComponent } from './player/player.component';
import { ScenariosFiltersComponent } from './scenarios-filters/scenarios-filters.component';
import { ScenarioMetricsComponent } from './scenario-metrics/scenario-metrics.component';
import { ScenarioInfoComponent } from './scenario-info/scenario-info.component';
import { ScenarioLearnersComponent } from './scenario-learners/scenario-learners.component';
import { LearnersFiltersComponent } from './learners-filters/learners-filters.component';
import { TemplatesComponent } from './templates/templates.component';
import { ScenariosHeaderComponent } from './scenarios-header/scenarios-header.component';
import { TemplateCreateComponent } from './template-create/template-create.component';
import { InputErrorComponent } from './input-error/input-error.component';
import { UploadRecordVideoComponent } from './upload-record-video/upload-record-video.component';
import { AssignCoachComponent } from './assign-coach/assign-coach.component';
import { FileItemComponent } from './file-item/file-item.component';
import { TemplateDeleteDialogComponent } from './template-delete-dialog/template-delete-dialog.component';
import { ScenarioLearnersAdminComponent } from './scenario-learners/scenario-learners-admin.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ScenariosRoutingModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    MatDialogModule,
    MatAutocompleteModule,
    SharedModule,
    MatMenuModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule
  ],
  declarations: [
    ScenariosComponent,
    ListComponent,
    DetailsComponent,
    LimitPipe,
    SearchPipe,
    ChatComponent,
    PlayerComponent,
    TimePipe,
    ScenariosFilterPipe,
    ScenariosFiltersComponent,
    ScenarioMetricsComponent,
    ScenarioInfoComponent,
    ScenarioLearnersComponent,
    ScenarioLearnersAdminComponent,
    LearnersFiltersComponent,
    LearnersFilterPipe,
    FormatSecondsWithMinutesPipe,
    BytesToMbPipe,
    TemplatesComponent,
    ScenariosHeaderComponent,
    TemplateCreateComponent,
    InputErrorComponent,
    DaysDistancePipe,
    UploadRecordVideoComponent,
    AssignCoachComponent,
    FileItemComponent,
    TemplateDeleteDialogComponent
  ],
  providers: [MatDatepickerModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScenariosModule {}
