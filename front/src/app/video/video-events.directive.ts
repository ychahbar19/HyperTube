import { Directive, HostListener, Input } from '@angular/core';

import { VideoService } from './video.service';

@Directive({
  selector: '[appVideoEvents]',
})
export class VideoEventsDirective {
  @Input() torrentHash: object;
  @Input() status: string;
  // private error = false;

  constructor(private videoService: VideoService) { }

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
  async onError(target: any) {
    if (target.error.code === 3 && target.seeking && this.status === 'downloading') {
      const seekTime = target.currentTime;
      await this.videoService.streamVideo(this.torrentHash, target.currentTime, target.duration);
      target.load();
      target.currentTime = seekTime;
      target.play();
    }
  }

  // @HostListener('seeking', ['$event.target'])
  // async onSeeking(target: any) {
  //   const seekTime = target.currentTime;
  //   const a = false;
  //   if (this.status === 'downloading' && a) {
  //     await this.videoService.streamVideo(this.torrentHash, target.currentTime, target.duration);
  //     if (this.error) {
  //       this.error = false;
  //       target.load();
  //       target.currentTime = seekTime;
  //       target.play();
  //     }
  //   }
  // }

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
