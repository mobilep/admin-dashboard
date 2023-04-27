import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// component
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        children: [
          { path: 'sign-in', component: SignInComponent },
          { path: 'forgot-password', component: ForgotPasswordComponent },
          { path: 'change-password', component: ChangePasswordComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
