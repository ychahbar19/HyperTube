//Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Base components
import { HomeComponent } from './home/home.component';

//User components
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
  //import { SignupComponent } from './signup/signup.component';
  //import { SigninComponent } from './signin/signin.component';
import { AuthGuard } from './auth/auth.guard';

//Video components
import { SearchComponent } from './search/search.component';
  //import { GalleryComponent } from './gallery/gallery.component';
import { VideoComponent } from './video/video.component';

//Routes
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'search', component: SearchComponent },
    //{ path: 'gallery', component: GalleryComponent, canActivate: [AuthGuard] }
  { path: 'video/:imdb_id/:yts_id', component: VideoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
