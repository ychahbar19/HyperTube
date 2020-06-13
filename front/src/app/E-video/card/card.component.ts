import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';
import { VideoCardService } from './card.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video',
  providers: [VideoCardService],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class VideoCardComponent implements OnInit {
  private imdbId: string;
  private ytsId: string;
  private videoPlayer: HTMLVideoElement;

  public videoInfos = {};
  public torrentHash: object;
  public stream: any;
  public isLoading = true;
  public subEnPath: any;
  public subFrPath: any;

  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    With:             { en: 'With', fr: 'Avec' },
    By:               { en: 'By', fr: 'Par' },
    'Upload year':    { en: 'Upload year', fr: 'Année d\'upload' },
    Size:             { en: 'Size', fr: 'Taille' },
    Seeds:            { en: 'Seeds', fr: 'Seeds' },
    Peers:            { en: 'Peers', fr: 'Peers' },
    Play:             { en: 'Play', fr: 'Regarder' }
  };

  // 2) Defines the variables imdb_id and yts_id by taking the values in the URL.
  constructor(private videoCardService: VideoCardService,
              private http: HttpClient,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      // tslint:disable-next-line: no-string-literal
      this.imdbId = params['imdb_id'];
      // tslint:disable-next-line: no-string-literal
      this.ytsId = params['yts_id'];
    });
  }

  // 3) Calls getVideoInfo() (in video.service.ts) to fetch the video's info
  // from the API (back), and saves them in the array 'video' for output
  // in video.component.html.
  async ngOnInit() {
    this.videoInfos = await this.videoCardService.getVideoInfo(this.imdbId, this.ytsId);
    this.isLoading = false;
  }

  // 4)
  @ViewChild('videoPlayer', { static: false }) set content(content: ElementRef) {
    if (content) {
      this.videoPlayer = content.nativeElement;
    }
  }

  // 5) Launches the download/stream process for the video clicked,
  // by sending its torrent hash to videoCardService.streamVideo()
  // and getting the video's source url in return.
  async streamVideo(index: number) {
    // register the video as seen in the DB
    // const seen = this.http.get('http://localhost:3000/api/video/seenVideo');
    // console.log(seen);
    
    // tslint:disable-next-line: no-string-literal
    const torrentHash = this.videoInfos['Torrents'][index].hash;
    this.stream = 'http://localhost:3000/api/video/stream/' + torrentHash + '/' + this.imdbId;
    setTimeout(() => {
      // pour atteindre la variable videoPlayer une fois qu'elle est set
      console.log(this.videoPlayer);
    });
    // this.subEnPath = "http://localhost:3000/assets/subtitles/" + this.videoInfos['Torrents'][index].hash + '/' + this.videoInfos['Torrents'][index].hash + '.en.vtt';
    // this.subFrPath = "http://localhost:3000/assets/subtitles/" + this.videoInfos['Torrents'][index].hash + '/' + this.videoInfos['Torrents'][index].hash + '.fr.vtt';
    this.subEnPath = 'http://localhost:3000/api/video/subtitles/' + 'en' + '/' + torrentHash;
    this.subFrPath = 'http://localhost:3000/api/video/subtitles/' + 'fr' + '/' + torrentHash;
  }
}
