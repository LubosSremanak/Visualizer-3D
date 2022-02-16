import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {faArrowLeft, faArrowRight, faPause, faPlay, faStop, faUpload} from '@fortawesome/free-solid-svg-icons';
import {LottieAnimationsService} from "../../shared/lottie-ls/service/lottie-animations.service";

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit, AfterViewInit {
  public songVibe: Uint8Array | undefined;
  actualSong: number;
  @ViewChild('song') song: ElementRef | undefined;
  height: string;
  width: string;
  readonly songs: number;
  private analyser: AnalyserNode | undefined;
  private trend: number;
  private trendLength: number;
  private randomColor: string;
  private randomColor2: string;
  private seconds: number;
  private lastTime: number;
  faPlay = faPlay;
  faStop = faStop;
  faPause = faPause;
  faRight = faArrowRight;
  faLeft = faArrowLeft;
  faUpload = faUpload;

  constructor(private lottieService: LottieAnimationsService,
              private ngZone: NgZone,
              private changeDetector: ChangeDetectorRef) {
    this.height = '20vh';
    this.width = '20vw';
    this.trend = 0;
    this.trendLength = 0;
    this.randomColor = this.generateRandomColor();
    this.randomColor2 = this.generateRandomColor();
    this.actualSong = 1;
    this.songs = 7;
    this.lastTime = (new Date()).getTime();
    this.seconds = 0;
  }

  ngOnInit(): void {
    this.render();
  }

  analyzeSong(size: number): Uint8Array | undefined {
    if (this.analyser) {
      this.analyser.fftSize = size;
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
      return dataArray;
    }
    return undefined;
  }

  ngAfterViewInit(): void {

  }

  generateRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  init(id: string) {
    const lottie = this.lottieService.getAnimationById(id);
    lottie?.setSpeed(0);
  }

  barStyle(value: number) {
    return {
      'height': value / 255 * 95 + '%', 'width': '100%',
      background: this.randomColor
    };
  }

  danceFloorColor() {
    const boxShadow = '0 0 200px' + this.randomColor;
    return {'box-shadow': boxShadow};
  }

  randomGradient() {
    const gradient = 'radial-gradient(circle, rgba(0,0,0,1) 21%,' + this.randomColor2 + ' 80%)';
    return {background: gradient};
  }

  startParty() {
    this.song?.nativeElement.play();
    this.extractSongVibe();
    const song: HTMLAudioElement = this.song?.nativeElement;
    if (!this.analyser) {
      const context = new AudioContext();
      const src = context.createMediaElementSource(song);
      const analyser = context.createAnalyser();
      src.connect(analyser);
      analyser.connect(context.destination);
      this.analyser = analyser;
    }
  }

  stopParty() {
    this.song?.nativeElement.load();
  }

  pauseParty() {
    this.song?.nativeElement.pause();
  }


  extractSongVibe(): Uint8Array | undefined {
    if (this.songVibe) {
      return this.songVibe.filter(this.isValueInRange);
    }
    return undefined;
  }

  nextSong() {
    this.actualSong++;
    if (this.actualSong > this.songs) {
      this.actualSong = 1;
    }
    const src = 'assets/songs/song' + this.actualSong + '.mp3';
    this.song?.nativeElement.setAttribute('src', src);
    this.startParty();
  }

  statsResult() {


  }

  private render = (): void => {
    this.ngZone.runOutsideAngular(() => {
      let vibe = this.analyzeSong(256);
      this.songVibe = vibe?.slice(8, 64);
      vibe = vibe?.slice(8, 64);
      const sum = vibe?.reduce(this.handleSum);
      const currentTime = (new Date()).getTime();
      if (sum && vibe) {
        const mean = sum / vibe?.length;
        let scaled = (mean / 255) / 0.4;
        scaled = parseInt(scaled.toFixed(2))
        if (scaled <= 0.1) {
          scaled = 0.5;
        }
        if (this.trendLength <= 15 && this.trend >= 160) {
          scaled = 3;
        }
        if (mean > this.trend + 30 || mean < this.trend - 30) {
          this.changeAnimationSpeed(scaled);
          this.randomColor = this.generateRandomColor();
          this.randomColor2 = this.generateRandomColor();
          this.trend = mean;
          this.trendLength = 0;
        }
        if (this.trendLength <= 25 && this.trend >= 94) {
          document.body.style.backgroundColor = this.generateRandomColor();
          this.seconds = 0;
        }
        if (currentTime - this.lastTime >= 100) {
          this.lastTime = currentTime;
          this.seconds += 0.1;
        }
        this.trendLength++;
        this.changeDetector.detectChanges();
      }
      requestAnimationFrame(this.render)
    });
  };

  private changeAnimationSpeed(speed: number): void {
    const monkey = this.lottieService.getAnimationById('monkey');
    monkey?.setSpeed(speed);
    const morty = this.lottieService.getAnimationById('morty');
    morty?.setSpeed(speed);
    const cavo = this.lottieService.getAnimationById('cavo');
    cavo?.setSpeed(speed);
  }

  private isValueInRange = (value: number, index: number): boolean => {
    const len = this.songVibe!.length;
    return (index < 6 || index > len - 6 || index >= len / 3 && index <= (len / 3) + 6);
  };

  private handleSum = (acc: number, cur: number) => acc + cur;

  previousSong() {
    this.actualSong--;
    if (this.actualSong <= 0) {
      this.actualSong = this.songs;
    }
    const src = 'assets/songs/song' + this.actualSong + '.mp3';
    this.song?.nativeElement.setAttribute('src', src);
    this.startParty();
  }

  uploadMusic(data: any) {
    const files = data.target.files;
    const music = files[0];
    this.song?.nativeElement.setAttribute("src", URL.createObjectURL(music));
    data.target.value = '';
    this.startParty();
  }
}
