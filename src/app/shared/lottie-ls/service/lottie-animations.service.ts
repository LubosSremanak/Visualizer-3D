import {Injectable} from '@angular/core';
import {Lottie} from '../model/lottie';
import {AnimationItem, AnimationSegment} from 'lottie-web';

@Injectable({
  providedIn: 'root',
})
export class LottieAnimationsService {
  private readonly _animations: Map<string, Lottie>;

  constructor() {
    this._animations = new Map<string, Lottie>();
  }

  get length(): number {
    return this._animations.size;
  }

  get animations(): Map<string, Lottie> {
    return this._animations;
  }

  public removeAnimationById(id: string | null): void {
    if (id) {
      this._animations.delete(id);
    }
  }

  public createLottie(id: string, options: any): void {
    const animation: Lottie = {options};
    if (this.animations.has(id)) {
      console.error('Duplicate ID', id);
    }
    this._animations.set(id, animation);
  }

  public getAnimationById(id: string): AnimationItem | null | undefined {
    return this._animations.get(id)?.reference;
  }

  public getAnimationOptionsById(id: string): any {
    return this._animations.get(id)?.options;
  }

  public playAnimationInRange(
    id: string,
    frames: number[],
    playNow: boolean
  ): void {
    const animation: AnimationItem | null | undefined =
      this.getAnimationById(id);
    if (animation) {
      animation.playSegments(frames as AnimationSegment, playNow);
    }
  }

  public playAnimation(id: string): void {
    const animation: AnimationItem | null | undefined =
      this.getAnimationById(id);
    if (animation) {
      const segments: AnimationSegment = [0, animation.totalFrames];
      animation.playSegments(segments, true);
    }
  }

  public addAnimationReference(id: string, reference: AnimationItem): void {
    const lottie: Lottie | undefined = this._animations.get(id);
    if (lottie) {
      lottie.reference = reference;
    } else {
      console.warn("Lottie doesn't exist");
    }
  }
}
