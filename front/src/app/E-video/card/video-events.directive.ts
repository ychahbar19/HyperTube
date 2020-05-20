import { Directive, HostListener, Input } from '@angular/core';

import { VideoCardService } from './card.service';

@Directive({
  selector: '[appVideoEvents]',
})
export class VideoEventsDirective {
  @Input() torrentHash: object;
  @Input() status: string;
  private canSeek = true;

  constructor(private videoService: VideoCardService) { }

  // @HostListener('play', ['$event.target'])
  // onPlay(target: any) {
  //   console.log(target, 'is playing');
  // }
  // @HostListener('pause', ['$event.target'])
  // onPause(target: any) {
  //   console.log(target, 'has been paused');
  // }
  // @HostListener('ended', ['$event.target'])
  // onEnded(target: any) {
  //   console.log(target, 'is ended');
  // }

  @HostListener('error', ['$event.target'])
  onError(target: any) {
    console.log(target.error);
    // if (target.error.code === 3 && target.seeking && this.status === 'downloading') {
    //   const seekTime = target.currentTime;
    //   await this.videoService.streamVideo(this.torrentHash, target.currentTime, target.duration);
    //   target.load();
    //   target.currentTime = seekTime;
    //   target.play();
    // }
  }

  @HostListener('seeking', ['$event.target'])
  async onSeeking(target: any) {
    const seekTime = target.currentTime;
    console.log(this.canSeek);
    if (this.status === 'downloading') {
      // this.canSeek = !this.canSeek;
      await this.videoService.streamVideo(this.torrentHash, target.currentTime, target.duration);
      target.pause();
      target.fastSeek = seekTime;
      target.play();
      // console.log(resp);
      // this.canSeek = !this.canSeek;
    }
  }

  // @HostListener('abort', ['$event.target'])
  // onAbort(target: any) {
  //   console.log('aborted');
  // }
  // @HostListener('salled', ['$event.target'])
  // onStalled(target: any) {
  //   console.log('stalled');
  // }
  // @HostListener('suspend', ['$event.target'])
  // onSuspend(target: any) {
  //   console.log('suspended');
  // }
  // @HostListener('waiting', ['$event.target'])
  // onWaiting(target: any) {
  //   console.log('waiting');
  // }
}
