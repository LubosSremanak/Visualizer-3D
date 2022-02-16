import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {playerFactory} from './model/playerFactory';
import {LottieComponent} from './lottie.component';
import {LottieModule as LottieNGXModule} from 'ngx-lottie';

@NgModule({
  declarations: [LottieComponent],
  exports: [LottieComponent],
  imports: [CommonModule, LottieNGXModule.forRoot({player: playerFactory})],
})
export class LottieModule {
}
