import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AccessComponent } from './components/common/access/access.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { CompanyFormComponent } from './components/companies/company-form/company-form.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AccessComponent,
          pathMatch: 'full',
          canActivate: [AuthGuard]
        },
        {
          path: 'auth',
          loadChildren: 'app/components/auth/auth.module#AuthModule'
        },
        {
          path: 'companies',
          component: CompaniesComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'company/add',
          component: CompanyFormComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'company/:id/edit',
          component: CompanyFormComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'company/:id/scenarios',
          loadChildren: 'app/scenarios/scenarios.module#ScenariosModule',
          canActivate: [AuthGuard]
        },
        {
          path: 'company/:id/people',
          loadChildren: 'app/components/people/people.module#PeopleModule',
          canActivate: [AuthGuard]
        },
        {
          path: 'company/:id/metrics',
          loadChildren: 'app/metrics/metrics.module#MetricsModule',
          canActivate: [AuthGuard]
        },
        { path: '**', redirectTo: '' }
      ],
      { useHash: true }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
