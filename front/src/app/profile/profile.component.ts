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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
