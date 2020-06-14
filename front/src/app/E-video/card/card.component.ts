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
    With:          { en: 'With', fr: 'Avec' },
    By:            { en: 'By', fr: 'Par' },
    'Upload year': { en: 'Upload year', fr: 'Année d\'upload' },
    Size:          { en: 'Size', fr: 'Taille' },
    Seeds:         { en: 'Seeds', fr: 'Seeds' },
    Peers:         { en: 'Peers', fr: 'Peers' },
    Play:          { en: 'Play', fr: 'Regarder' }
  };

  // 2) Defines the variables imdb_id and yts_id by taking the values in the URL.
  constructor(private videoCardService: VideoCardService,
              private route: ActivatedRoute)
  {
    this.route.params.subscribe(params =>
    {
      this.imdbId = params['imdb_id'];
      this.ytsId = params['yts_id'];
    });
  }

  // 3) Calls getVideoInfo() (in video.service.ts) to fetch the video's info
  // from the API (back), and saves them in the array 'video' for output
  // in video.component.html.
  async ngOnInit()
  {
    this.videoInfos = await this.videoCardService.getVideoInfo(this.lg, this.imdbId, this.ytsId);
    this.videoInfos['rating_average'] = this.videoInfos['imdbRating'] / 2 +'/5';
    this.videoInfos['ratings_count'] = '(' + this.videoInfos['imdbVotes'] + ' votes)';
    if (this.lg == 'fr')
    {
      if (this.videoInfos['title'] != this.videoInfos['Title'])
        this.videoInfos['Title'] = this.videoInfos['Title'] + ' (' + this.videoInfos['title'] + ')';
      this.videoInfos['rating_average'] = this.videoInfos['rating_average'].replace('.', ',');
      this.videoInfos['ratings_count'] = this.videoInfos['ratings_count'].replace(',', '.');
      this.videoInfos['Genre'] = this.videoInfos['Genre']
        .replace('Adventure', 'Aventure')
        .replace('Biography', 'Biographie')
        .replace('Comedy', 'Comedie')
        .replace('Documentary', 'Documentaire')
        .replace('Drama', 'Drame')
        .replace('Family', 'Famille')
        .replace('Fantasy', 'Fantaisie')
        .replace('History', 'Histoire')
        .replace('Horror', 'Horreur')
        .replace('Music', 'Musique')
        .replace('Musical', 'Comédie musicale')
        .replace('Mystery', 'Mystère')
        .replace('Short Film', 'Court-métrage')
        .replace('Superhero', 'Super-héro')
        .replace('War', 'Guerre');
      this.videoInfos['Plot'] = this.videoInfos['overview'];
    }
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
    // tslint:disable-next-line: no-string-literal
    const torrentHash = this.videoInfos['Torrents'][index].hash;
    this.stream = 'http://localhost:3000/api/video/stream/' + torrentHash + '/' + this.imdbId;
    setTimeout(() => {
      // pour atteindre la variable videoPlayer une fois qu'elle est set
      console.log(this.videoPlayer);
    });
    this.subEnPath = "http://localhost:3000/assets/subtitles/" + this.videoInfos['Torrents'][index].hash + '/' + this.videoInfos['Torrents'][index].hash + '.en.vtt';
    this.subFrPath = "http://localhost:3000/assets/subtitles/" + this.videoInfos['Torrents'][index].hash + '/' + this.videoInfos['Torrents'][index].hash + '.fr.vtt';
  }
}
