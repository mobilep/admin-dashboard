import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// routing
import { AuthRoutingModule } from './auth-routing.module';
// components
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, AuthRoutingModule, FormsModule, TranslateModule.forChild()],
  declarations: [
    ForgotPasswordComponent,
    ChangePasswordComponent,
    SignInComponent,
    AuthComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }
