// Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Base components
import { HomeComponent } from './home/home.component';

// User components
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
  // import { SignupComponent } from './signup/signup.component';
  // import { SigninComponent } from './signin/signin.component';
import { AuthGuard } from './auth/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './edit/edit.component';

// Video components
import { SearchComponent } from './search/search.component';
// import { GalleryComponent } from './gallery/gallery.component';
import { VideoComponent } from './video/video.component';

// Routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'profile/:id?', component: ProfileComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'profile', component: ProfileComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'edit', component:  EditComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'search', component: SearchComponent },
  { path: 'video/:imdb_id/:yts_id', component: VideoComponent/*, canActivate: [AuthGuard]*/ }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
