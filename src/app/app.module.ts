import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// routing
import { AppRoutingModule } from './app-routing.module';
// vendor
import { CookieModule } from 'ngx-cookie';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireModule } from '@angular/fire';
// service
import { AuthService } from './services/auth.service';
import { CompaniesService } from './services/companies.service';
import { CSVService } from './services/csv.service';
import { HttpService } from './services/http.service';
import { ReportingService } from './services/reporting.service';
import { UserService } from './services/user.service';
import { CountriesService } from './services/countries.service';
import { LanguagesService } from './services/languages.service';
import { StoreService } from './services/store.service';
// guard
import { AuthGuard } from './guards/auth.guard';
// components
import { AppComponent } from './app.component';
import { AccessComponent } from './components/common/access/access.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { HeaderComponent } from './components/common/header/header.component';
import { CompanyFormComponent } from './components/companies/company-form/company-form.component';
import { EditPasswordComponent } from './components/profile/edit-password/edit-password.component';
import { CompanyDeleteComponent } from './components/companies/company-delete/company-delete.component';
import { PeopleDeleteComponent } from './components/people/people-delete/people-delete.component';
import { SendEmailComponent } from './components/common/send-email/send-email.component';
import { ImportResultComponent } from './components/people/import-result/import-result.component';

import { Interceptor } from './interceptors/http.interceptor';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/locale/');
}

@NgModule({
  declarations: [
    AppComponent,
    AccessComponent,
    CompaniesComponent,
    HeaderComponent,
    CompanyFormComponent,
    EditPasswordComponent,
    CompanyDeleteComponent,
    PeopleDeleteComponent,
    SendEmailComponent,
    ImportResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatDialogModule,
    MatTableModule,
    ToastrModule.forRoot(),
    CookieModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    CompaniesService,
    CSVService,
    HttpService,
    ReportingService,
    UserService,
    CountriesService,
    LanguagesService,
    StoreService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
