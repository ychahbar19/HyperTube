//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { AppRoutingModule } from './app-routing.module';

//Base components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

//User components
import { OmniauthComponent } from './auth/omniauth/omniauth.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ErrorInterceptor } from './error/error-interceptor';
  //import { OauthComponent } from './oauth/oauth.component';
  //import { SignupComponent } from './signup/signup.component';
  //import { SigninComponent } from './signin/signin.component';
import { ProfileComponent } from './profile/profile.component';

//Video components
import { SearchComponent } from './search/search.component';
  //import { GalleryComponent } from './gallery/gallery.component';
import { VideoComponent } from './video/video.component';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent, HomeComponent,
    OmniauthComponent, SignupComponent, SigninComponent, /*OauthComponent,*/ ProfileComponent,
    SearchComponent, /*GalleryComponent,*/ VideoComponent, CommentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(), NgBootstrapFormValidationModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
