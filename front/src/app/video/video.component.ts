/*
VIDEO (members only)
  ==> ? | Check restriction

Page content:
  - Video info:
    .mandatory: name, torrent links
    .if available: summary, pic, production date, rating, duration, cast
    ==> :D | OK

  - Streaming player with subtitles (in user's preferred language, if audio not in that language)
    ==> :( | To do

  - User comments
    ==> :S | Missing backend data validation and user info from session (id, name, avatar)
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  providers: [VideoService],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
/*
export class VideoComponent implements OnInit, OnDestroy
{
  public video: VideoModel = {
                    _id: '',
                    name: '',
                    summary: ''
                  };
  private videoSubscription: Subscription;

  constructor(private videoService: VideoService) {}

  ngOnInit()
  {
    this.videoService.getVideo();
    this.videoSubscription = this.videoService.getVideoUpdateListener()
      .subscribe((video: VideoModel) =>
      {
        this.video = video;
      });
  }

  ngOnDestroy()
  {
    this.videoSubscription.unsubscribe();
  }
}
*/
export class VideoComponent implements OnInit
{
  private imdb_id;
  private yts_id;
  public video = {};

  constructor(private videoService: VideoService,
              private route: ActivatedRoute)
  {
    this.route.params.subscribe(params =>
    {
      this.imdb_id = params['imdb_id'];
      this.yts_id = params['yts_id'];
    });
  }

  async ngOnInit()
  {
    this.video = await this.videoService.getVideoInfo(this.imdb_id, this.yts_id);
  }
}
