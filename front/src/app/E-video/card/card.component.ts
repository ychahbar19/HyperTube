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
  public isSeen: any;

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
              private http: HttpClient,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.imdbId = params['imdb_id'];
      this.ytsId = params['yts_id'];
    });
  }

  // 3) Calls getVideoInfo() (in video.service.ts) to fetch the video's info
  // from the API (back), and saves them in the array 'video' for output
  // in video.component.html.
  // and also check if the movie is actually already seen
  async ngOnInit()
  {
    this.videoInfos = await this.videoCardService.getVideoInfo(this.lg, this.imdbId, this.ytsId);
    this.isSeen = await this.videoCardService.checkIfSeen(this.imdbId);
    this.isLoading = false;

    if (this.videoInfos['imdbRating'] == undefined)
      this.videoInfos['imdbRating'] = 0;
    this.videoInfos['rating_average'] = this.videoInfos['imdbRating'] / 2 + '/5';
    if (this.lg === 'fr')
      this.videoInfos['rating_average'] = this.videoInfos['rating_average'].replace('.', ',');

    if (this.videoInfos['imdbVotes'] == 'N/A')
      this.videoInfos['imdbVotes'] = 0;
    this.videoInfos['ratings_count'] = '(' + this.videoInfos['imdbVotes'] + ' votes)';
    if (this.lg === 'fr')
      this.videoInfos['ratings_count'] = this.videoInfos['ratings_count'].replace(',', '.');

    if (this.videoInfos['Genre'] == 'N/A')
      this.videoInfos['Genre'] = '';
    if (this.lg === 'fr' && this.videoInfos['Genre'] != '')
    {
      this.videoInfos['Genre'] = this.videoInfos['Genre']
      .replace('Adventure', 'Aventure')
      .replace('Biography', 'Biographie')
      .replace('Comedy', 'Comédie')
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
    }

    if (this.lg === 'fr' &&
        this.videoInfos['title'] != undefined &&
        this.videoInfos['title'] !== this.videoInfos['Title'])
      this.videoInfos['Title'] = this.videoInfos['Title'] + ' (' + this.videoInfos['title'] + ')';

    if (this.lg === 'fr')
      this.videoInfos['Plot'] = this.videoInfos['overview'];
    
    this.videoInfos['Cast'] = '';
    if (this.videoInfos['Actors'] != 'N/A')
      this.videoInfos['Cast'] = this.txt['With'][this.lg] + ' ' + this.videoInfos['Actors'];
    
    this.videoInfos['Crew'] = '';
    if (this.videoInfos['Director'] != 'N/A')
      this.videoInfos['Crew'] += this.videoInfos['Director'] + ', ';
    if (this.videoInfos['Writer'] != 'N/A')
      this.videoInfos['Crew'] += this.videoInfos['Writer'] + ', ';
    if (this.videoInfos['Production'] != 'N/A')
      this.videoInfos['Crew'] += this.videoInfos['Production'] + ', ';
    if (this.videoInfos['Crew'] != '')
      this.videoInfos['Crew'] = this.txt['By'][this.lg] + ' ' + this.videoInfos['Crew'].slice(0, -2);
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
    this.http.get('http://localhost:3000/api/video/seenMovie/' + this.imdbId).subscribe(response => {});

    const torrentHash = this.videoInfos['Torrents'][index].hash;
    this.stream = 'http://localhost:3000/api/video/stream/' + torrentHash + '/' + this.imdbId;
    this.subEnPath = 'http://localhost:3000/api/video/subtitles/' + 'en' + '/' + torrentHash;
    this.subFrPath = 'http://localhost:3000/api/video/subtitles/' + 'fr' + '/' + torrentHash;
  }
}
