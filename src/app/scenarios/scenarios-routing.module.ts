import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScenariosComponent } from './scenarios.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { ChatComponent } from './chat/chat.component';
import { TemplatesComponent } from './templates/templates.component';
import { TemplateCreateComponent } from './template-create/template-create.component';

const routes: Routes = [
  {
    path: '',
    component: ScenariosComponent,
    children: [
      { path: '',   redirectTo: 'reporting', pathMatch: 'full' },
      {
        path: 'reporting',
        component: ListComponent
      },
      {
        path: 'templates/create',
        component: TemplateCreateComponent,
      },
      {
        path: 'templates/:templateId/edit',
        component: TemplateCreateComponent,
      },
      {
        path: 'templates',
        component: TemplatesComponent,
        pathMatch: 'full'
      },
      {
        path: ':scenarioId',
        component: DetailsComponent
      },
      {
        path: ':scenarioId/chat/:practiceId',
        component: ChatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScenariosRoutingModule {}
