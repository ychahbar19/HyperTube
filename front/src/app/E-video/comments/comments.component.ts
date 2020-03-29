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

  // 1) Defines the translations for the static text.
  public txt = {
    'Comments':         { en: 'Comments', fr: 'Commentaires' },
    'Write a comment':  { en: 'Write a comment', fr: 'Ecrivez un commentaire' },
    'Your name':        { en: 'Your name', fr: 'Entrez votre nom' },
    'Send':             { en: 'Send', fr: 'Envoyer' }
  };
  public lg = 'fr';

  // 2) Defines the variable imdb_id by taking the value in the URL.
  constructor(private commentsService: CommentsService,
              private route: ActivatedRoute)
  {
    this.route.params.subscribe(params =>
    {
      this.imdb_id = params['imdb_id'];
    });
  }

  // 2) Triggers fetchComments() defined below.
  async ngOnInit()
  {
    await this.fetchComments();
  }

  // 3) Calls fetchComments() (in comments.service.ts) to get the comments
  // from the API (back), and saves them in the array 'comments' for output
  // in comments.component.html.
  async fetchComments()
  {
    this.comments = await this.commentsService.fetchComments(this.imdb_id);
  }

  // 4) Calls postComment() (in comments.service.ts) to save a new comment in the db,
  // and (if it went OK) calls fetchComments() again to output the new comment,
  // plus resets the form.
  async postComment()
  {
    this.postResponse = await this.commentsService.postComment(this.imdb_id, this.formGroup.value);
    if (this.postResponse.message == 'OK')
    {
      await this.fetchComments();
      this.formGroup.reset();
    }
  }
}
