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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  providers: [VideoService],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
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
export class VideoComponent implements OnInit {
  public torrentHash: object;
  private imdbId: string;
  private ytsId: string;
  public video = {};
  public stream: any;
  private movie: HTMLVideoElement;
  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef;

  constructor(
    private videoService: VideoService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      // tslint:disable-next-line: no-string-literal
      this.imdbId = params['imdb_id'];
      // tslint:disable-next-line: no-string-literal
      this.ytsId = params['yts_id'];
    });
  }

  async ngOnInit() {
    this.video = await this.videoService.getVideoInfo(this.imdbId, this.ytsId);
    console.log(this.video);
  }

  async streamVideo(index: number) {
    // tslint:disable-next-line: no-string-literal
    this.torrentHash = { hash: this.video['Torrents'][index].hash };
    this.stream = await this.videoService.streamVideo(this.torrentHash);
    // console.log(this.stream);
    this.stream.src = this.stream.src
      .replace(/ /g, '%20')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D');
    // console.log(this.stream);
  }

  logTime() {
    this.videoPlayer.nativeElement.ondurationchange = () => {
      console.log(this.videoPlayer.nativeElement.currentTime);
    };
    // this.movie.play();
    console.log('playing');
  }
}
