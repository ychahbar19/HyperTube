/*
VIDEO (members only)
Content:
  - Video info:
    .mandatory: name
    .if available: summary, pic, production date, rating, duration, cast
  - Streaming player with subtitles (in user's preferred languag, if audio not in that language)
  - User comments
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { VideoModel } from './video.model';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  providers: [VideoService],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
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
