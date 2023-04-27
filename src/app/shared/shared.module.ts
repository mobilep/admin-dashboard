import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateModule } from '@ngx-translate/core';

// pipes
import { SortPipe } from './pipes/sort.pipe';

// Components
import { IconComponent } from './components/icon/icon.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MetricTileComponent } from './components/metric-tile/metric-tile.component';
import { SectionToggleComponent } from './components/section-toggle/section-toggle.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { UserWithAvatarComponent } from './components/user-with-avatar/user-with-avatar.component';
import { StarsRatingComponent } from './components/stars-rating/stars-rating.component';
import { ListFiltersComponent } from './components/list-filters/list-filters.component';

const PUBLIC_API_COMPONENTS = [
  IconComponent,
  PaginationComponent,
  MetricTileComponent,
  SectionToggleComponent,
  DataTableComponent,
  AvatarComponent,
  UserWithAvatarComponent,
  StarsRatingComponent,
  ListFiltersComponent
];

const PUBLIC_API_PIPES = [SortPipe];

@NgModule({
  declarations: [...PUBLIC_API_COMPONENTS, ...PUBLIC_API_PIPES],
  imports: [CommonModule, InlineSVGModule.forRoot(), NgxPaginationModule, TranslateModule],
  exports: [...PUBLIC_API_COMPONENTS, ...PUBLIC_API_PIPES, NgxPaginationModule, TranslateModule]
})
export class SharedModule {}
