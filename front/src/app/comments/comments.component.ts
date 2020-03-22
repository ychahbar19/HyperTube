/*
COMMENTS (from video page only, so members only)
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  public comments;
  public formGroup = new FormGroup(
  {
    Comment: new FormControl('', [ Validators.required, Validators.minLength(10) ]),
    Name: new FormControl('', [ Validators.required, Validators.minLength(2) ]),
  });
  public postResponse;

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
    await this.readComments();
  }

  async readComments()
  {
    this.comments = await this.commentsService.readComments(this.imdb_id);
  }

  async postComment()
  {
    this.postResponse = await this.commentsService.postComment(this.imdb_id, this.formGroup.value);
    if (this.postResponse.message == 'OK')
    {
      await this.readComments();
      this.formGroup.reset();
    }
  }
}
