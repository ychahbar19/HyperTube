//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

//Base components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

//User components
import { OauthComponent } from './oauth/oauth.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

//Video components
import { SearchComponent } from './search/search.component';
import { VideoComponent } from './video/video.component';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, FooterComponent, HomeComponent,
    OauthComponent, SignupComponent, SigninComponent,
    SearchComponent, VideoComponent, CommentsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
