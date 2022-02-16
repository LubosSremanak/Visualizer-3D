import {Component, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {AnimationItem} from 'lottie-web';
import {LottieAnimationsService} from './service/lottie-animations.service';

@Component({
  selector: 'app-lottie',
  templateUrl: './lottie.component.html',
  styleUrls: ['./lottie.component.scss'],
})
export class LottieComponent implements OnInit, OnDestroy {
  @Input() lottieId: string | null;
  @Input() path: string | null;
  @Input() loop: boolean | null;
  @Input() autoPlay: boolean | null;
  @Input() hoverPlay: boolean | null;
  @Input() width: string | null;
  @Input() height: string | null;
  @Output() isLoaded: EventEmitter<string> = new EventEmitter<string>();

  constructor(private lottieService: LottieAnimationsService) {
    this.lottieId = null;
    this.path = null;
    this.loop = false;
    this.autoPlay = false;
    this.hoverPlay = false;
    this.width = null;
    this.height = null;
  }

  private _animation: AnimationItem | undefined;

  get animation(): AnimationItem {
    return <AnimationItem>this._animation;
  }

  private _animationOptions: any;

  get animationOptions(): any {
    return this._animationOptions;
  }

  ngOnDestroy(): void {
    this.lottieService.removeAnimationById(this.lottieId);
  }

  ngOnInit(): void {
    this._animationOptions = {
      path: this.path,
      loop: this.loop,
      autoplay: this.autoPlay,
    };
    if (!this.lottieId) {
      this.lottieId = String(this.lottieService.length);
      console.warn('New id', this.lottieId);
      console.log(this.lottieService.animations);
    }
    if (!this.path) {
      throw new Error('"path" can\'t be empty!');
    }
    this.lottieService.createLottie(this.lottieId, this.animationOptions);
  }

  animationCreated(animationItem: AnimationItem): void {
    this._animation = animationItem;
    this.animation.setSubframe(false);
    this.lottieService.addAnimationReference(this.lottieId!, this.animation);
    this.isLoaded.emit(this.lottieId!);
  }

  onHover(): void {
    if (this.lottieId && this.hoverPlay) {
      this.lottieService.playAnimation(this.lottieId);
    }
  }

  clearHover(): void {
    // this.lottieService.playAnimationInRange(this.lottieId, [], false);
  }
}
