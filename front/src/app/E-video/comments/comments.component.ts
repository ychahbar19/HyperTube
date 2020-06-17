import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  providers: [CommentsService],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  private imdbId;
  private ytsId;

  public comments;
  public formGroup = new FormGroup(
  {
    Comment: new FormControl('', [ Validators.required ])
  });
  public postResponse;

  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    Title:            { en: 'Add a comment', fr: 'Ajoutez un commentaire'},
    Comment:          { en: 'Your comment...', fr: 'Votre commentaire...' },
    Send:             { en: 'Send', fr: 'Envoyer' },
    DeletedUser:      { en: 'Deleted User', fr: 'Utilisateur supprimé' }
  };

  // 2) Defines the variable imdb_id and yts_id by taking the value in the URL.
  constructor(private commentsService: CommentsService,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.imdbId = params['imdb_id'];
      this.ytsId = params['yts_id'];
    });
  }

  // 2) Triggers fetchComments() defined below.
  async ngOnInit() {
    await this.fetchComments();
  }

  // 3) Calls fetchComments() (in comments.service.ts) to get the comments
  // from the API (back), and saves them in the array 'comments' for output
  // in comments.component.html.
  async fetchComments() {
    this.comments = await this.commentsService.fetchComments(this.imdbId, this.lg);
  }

  // 4) Calls postComment() (in comments.service.ts) to save a new comment in the db,
  // and (if it went OK) calls fetchComments() again to output the new comment,
  // plus resets the form.
  async postComment() {
    this.postResponse = await this.commentsService.postComment(this.imdbId, this.ytsId, this.formGroup.value, this.lg);
    if (this.postResponse.message === 'OK') {
      await this.fetchComments();
      this.formGroup.reset();
    }
  }
}
