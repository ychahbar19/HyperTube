/*
COMMENTS (from video page only, so members only)
*/

import { Component, OnInit } from '@angular/core';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  providers: [CommentsService],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit
{
  public comments = {};

  constructor(private commentsService: CommentsService) {}

  async ngOnInit()
  {
    console.log('entering app-comments');
    this.comments = await this.commentsService.getComments();
  }
}
