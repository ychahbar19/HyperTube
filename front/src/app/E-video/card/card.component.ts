import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { ActivatedRoute } from '@angular/router';
import { VideoCardService } from './card.service';

@Component({
  selector: 'app-video',
  providers: [VideoCardService],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class VideoCardComponent implements OnInit
{
  private imdb_id;
  private yts_id;
  private completeResponse: any;
  // private movie: HTMLVideoElement;
  private videoPlayer: HTMLVideoElement;

  public video = {};
  public torrentHash: object;
  public stream: any;

  // 1) Defines the translations for the static text.
  public lg = AppComponent.userLanguage;
  public txt = {
    'With':           { en: 'With', fr: 'Avec' },
    'By':             { en: 'By', fr: 'Par' },
    'Upload year':    { en: 'Upload year', fr: 'Année d\'upload' },
    'Size':           { en: 'Size', fr: 'Taille' },
    'Seeds':          { en: 'Seeds', fr: 'Seeds' },
    'Peers':          { en: 'Peers', fr: 'Peers' },
    'Play now':       { en: 'Play now', fr: 'Regarder maintenant' },
    'Load and play':  { en: 'Load and play', fr: 'Charger et regarder' }
  };

  // 2) Defines the variables imdb_id and yts_id by taking the values in the URL.
  constructor(private videoCardService: VideoCardService,
              private route: ActivatedRoute)
  {
    this.route.params.subscribe(params =>
    {
      // tslint:disable-next-line: no-string-literal
      this.imdb_id = params['imdb_id'];
      // tslint:disable-next-line: no-string-literal
      this.yts_id = params['yts_id'];
    });
  }

  // 3) Calls getVideoInfo() (in video.service.ts) to fetch the video's info
  // from the API (back), and saves them in the array 'video' for output
  // in video.component.html.
  async ngOnInit()
  {
    this.video = await this.videoCardService.getVideoInfo(this.imdb_id, this.yts_id);
  }

  @ViewChild('videoPlayer', { static: false }) set content(
    content: ElementRef
  ) {
    if (content) {
      this.videoPlayer = content.nativeElement;
    }
  }

  async streamVideo(index: number) {
    // tslint:disable-next-line: no-string-literal
    this.torrentHash = { hash: this.video['Torrents'][index].hash };
    this.stream = await this.videoCardService.streamVideo(this.torrentHash);
    this.stream.src = this.stream.src
    .replace(/ /g, '%20')
    .replace(/\[/g, '%5B')
    .replace(/\]/g, '%5D');
    setTimeout(() => {
      // this.videoPlayer.play();
      console.log(this.videoPlayer);
    });
    // this.stream.status = await this.videoCardService.listenToComplete(this.torrentHash);
  }
}
