import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import videojs from 'video.js';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-vjs-player',
  template: `
    <video
      #target
      class="video-js"
      controls
      playsinline
      preload="none"
    ></video>
  `,
  styleUrls: ['./vjs-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VjsPlayerComponent implements OnInit, OnDestroy {
  private stream: any;
  private targetTime = null;
  @Input() torrentHash: object;
  @ViewChild('target', { static: true }) target: ElementRef;
  // see options: https://github.com/videojs/video.js/blob/mastertutorial-options.html
  @Input() options: {
    fluid: boolean;
    aspectRatio: string;
    autoplay: boolean;
    sources: {
      src: string;
      type: string;
    }[];
  };
  player: videojs.Player;

  constructor(private elementRef: ElementRef, private videoService: VideoService) {}

  ngOnInit() {
    // instantiate Video.js
    this.player = videojs(
      this.target.nativeElement,
      this.options
      // function onPlayerReady() {
      //   console.log('onPlayerReady', this);
      // }
    );
    // this.player.on('seeking', () => {
    //   console.log(this.player.buffered());
    //   console.log(this.player.buffered);
    //   console.log(this.player.buffered.length);
    //   const ranges = [];
    //   for (let i = 0; i < this.player.buffered.length; i++) {
    //     ranges.push([
    //       this.player.buffered.start(i),
    //       this.player.bufferes.end(i)
    //     ]);
    //   }
    //   console.log(ranges);
    // });
    this.player.on('error', async (error) => {
      console.log(this.player.error().code);
      // if (MediaError.code) {
        // this.targetTime = Math.floor(
        //   (this.player.currentTime() / this.player.duration()) * 100
        // );
        // console.log('hello');
        // const resp = await this.videoService.streamVideo(
          // this.torrentHash,
          // this.targetTime
        // );
        // console.log(resp);

        // this.player.dispose();
        // this.player = videojs(this.target.nativeElement, this.options);
        // this.player.currentTime(this.targetTime);
        // this.player.play();

      // }
    });
    // this.player.on('ended', () => {
    //   console.log('ended');
    // });
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }
}
