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
// import { Subscription } from 'rxjs';
import { VideoService } from './video.service';

@Component({
  selector: 'app-video',
  providers: [VideoService],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  public torrentHash: object;
  private imdbId: string;
  private ytsId: string;
  public videoInfos = {};
  public stream: any;
  private completeResponse: any;
  // private movie: HTMLVideoElement;
  private videoPlayer: HTMLVideoElement;
  @ViewChild('videoPlayer', { static: false }) set content(
    content: ElementRef
  ) {
    if (content) {
      this.videoPlayer = content.nativeElement;
    }
  }

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
    this.videoInfos = await this.videoService.getVideoInfo(this.imdbId, this.ytsId);
  }

  async streamVideo(index: number) {
    // tslint:disable-next-line: no-string-literal
    this.torrentHash = { hash: this.videoInfos['Torrents'][index].hash };
    const video = await this.videoService.streamVideo(this.torrentHash);
    const url = new URL(video.src);
    this.stream = 'http://localhost:3000/api/video/stream' + url.pathname;
    setTimeout(() => {
      // pour atteindre la variable videoPlayer une fois qu'elle est set
      console.log(this.videoPlayer);
    });
    // this.stream.status = await this.videoService.listenToComplete(this.torrentHash);
  }
}
