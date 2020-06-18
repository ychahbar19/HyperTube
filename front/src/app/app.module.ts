// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Base components
import { AppComponent } from './app.component';
import { HeaderComponent } from './A-template/header/header.component';
import { FooterComponent } from './A-template/footer/footer.component';
import { HomeComponent } from './B-home/home.component';

// Interceptor components
import { AuthInterceptor } from './C-auth/auth-interceptor';
import { ErrorInterceptor } from './error/error-interceptor';

// Authentification components
import { SignupComponent } from './C-auth/signup/signup.component';
import { SigninComponent } from './C-auth/signin/signin.component';
import { OmniauthComponent } from './C-auth/omniauth/omniauth.component';
import { ForgotPasswordComponent } from './C-auth/forgot-password/forgot-password.component';

// User components
import { ProfileComponent } from './D-user/profile/profile.component';
import { EditComponent } from './D-user/edit/edit.component';

// ????? components
import { RatingComponent } from './rating/rating.component';
import { StaticRateComponent } from './static-rate/static-rate.component';

// Video components
import { SearchComponent } from './E-video/search/search.component';
import { VideoCardComponent } from './E-video/card/card.component';
import { CommentsComponent } from './E-video/comments/comments.component';

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent, HomeComponent,
    SignupComponent, SigninComponent, OmniauthComponent, ForgotPasswordComponent,
    ProfileComponent, EditComponent,
    RatingComponent, StaticRateComponent,
    SearchComponent, VideoCardComponent, CommentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    // NgBootstrapFormValidationModule.forRoot(), NgBootstrapFormValidationModule,
    NgbModule,
    AppRoutingModule,
    InfiniteScrollModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
