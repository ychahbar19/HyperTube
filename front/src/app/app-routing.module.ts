//Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Base components
import { HomeComponent } from './home/home.component';

//User components
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';

//Video components
import { SearchComponent } from './search/search.component';
import { VideoComponent } from './video/video.component';

//Routes
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'search', component: SearchComponent},
  {path: 'video/:imdb_id', component: VideoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
