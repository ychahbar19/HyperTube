// Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Base components
import { HomeComponent } from './B-home/home.component';

// Authentification components
import { SignupComponent } from './C-auth/signup/signup.component';
import { SigninComponent } from './C-auth/signin/signin.component';
import { ForgotPasswordComponent } from './C-auth/forgot-password/forgot-password.component';
import { AuthGuard } from './C-auth/auth.guard';

// User components
import { ProfileComponent } from './D-user/profile/profile.component';
import { EditComponent } from './D-user/edit/edit.component';

// Video components
import { SearchComponent } from './E-video/search/search.component';
import { VideoCardComponent } from './E-video/card/card.component';

// Routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'profile/:id?', component: ProfileComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'profile', component: ProfileComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'edit', component:  EditComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'search', component: SearchComponent },
  { path: 'video/:imdb_id/:yts_id', component: VideoCardComponent/*, canActivate: [AuthGuard]*/ }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
