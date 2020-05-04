// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { AppRoutingModule } from './app-routing.module';
import { MatVideoModule } from 'mat-video';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Base components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

// User components
import { OmniauthComponent } from './auth/omniauth/omniauth.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { RatingComponent } from './rating/rating.component';
import { StaticRateComponent } from './static-rate/static-rate.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditComponent } from './edit/edit.component';

// Video components
import { SearchComponent } from './search/search.component';
import { VideoComponent } from './video/video.component';
import { CommentsComponent } from './comments/comments.component';

// Utils components
import { ErrorInterceptor } from './error/error-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VjsPlayerComponent } from './video/vjs-player/vjs-player.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SigninComponent,
    HomeComponent,
    SignupComponent,
    OmniauthComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    RatingComponent,
    StaticRateComponent,
    EditProfileComponent,
    EditComponent,
    SearchComponent,
    VideoComponent,
    CommentsComponent,
    VjsPlayerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatVideoModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
