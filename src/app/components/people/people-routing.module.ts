import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// component
import { PeopleComponent } from './people.component';
import { PeopleFormComponent } from './people-form/people-form.component';
import { PeopleListComponent } from './people-list/people-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PeopleComponent,
        children: [
          {
            path: 'list',
            component: PeopleListComponent
          },
          {
            path: 'add',
            component: PeopleFormComponent
          },
          {
            path: 'edit/:uid',
            component: PeopleFormComponent
          },
          { path: '', pathMatch: 'full', redirectTo: 'list' }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class PeopleRoutingModule { }
