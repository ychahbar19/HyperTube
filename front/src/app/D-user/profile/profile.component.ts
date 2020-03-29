/*
PROFILE (members only)
Content:
  - User info:
    - username
    - pic
    - last_name
    - first_name
  - Edit link
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: {};

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.user = params;
      }
    });
    this.http.post('http://localhost:3000/api/user/profile', this.user).subscribe(response => {
    console.log(response);
      
    this.user = response;
    }, error => {
      // if an error occured we redirect to gallery
      this.router.navigate(['/search']);
    });
  }

}
