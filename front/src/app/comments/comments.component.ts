/*
COMMENTS (from video page only, so members only)
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  providers: [CommentsService],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit
{
  private imdb_id;
  public comments = {};

  constructor(private commentsService: CommentsService,
              private route: ActivatedRoute)
  {
    this.route.params.subscribe(params =>
    {
      this.imdb_id = params['imdb_id'];
    });
  }

  async ngOnInit()
  {
    this.comments = await this.commentsService.getComments(this.imdb_id);
  }
}
