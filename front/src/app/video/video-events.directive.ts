import { Directive, HostListener, Input } from '@angular/core';

import { VideoService } from './video.service';

@Directive({
  selector: '[appVideoEvents]',
})
export class VideoEventsDirective {
  @Input() torrentHash: object;
  @Input() status: string;
  constructor(private videoService: VideoService) {}

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
  @HostListener('seeking', ['$event.target'])
  onSeeking(target: any) {
    console.log(this.torrentHash, this.status);
    if (this.status === 'downloading') {
      this.videoService.downloadParts(this.torrentHash, target.currentTime, target.duration);
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
  @HostListener('error', ['$event.target.error'])
  onError(error: any) {
    console.log(error);
    if (error.code === 3) {
      console.log('OK');
    }
  }
}
