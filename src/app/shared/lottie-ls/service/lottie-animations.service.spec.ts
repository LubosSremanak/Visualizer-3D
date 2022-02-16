import {TestBed} from '@angular/core/testing';

import {LottieAnimationsService} from './lottie-animations.service';

describe('LottieAnimationsService', () => {
  let service: LottieAnimationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LottieAnimationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
