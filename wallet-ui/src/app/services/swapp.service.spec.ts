import { TestBed, inject } from '@angular/core/testing';

import { SwappService } from './swapp.service';

describe('SwappService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwappService]
    });
  });

  it('should be created', inject([SwappService], (service: SwappService) => {
    expect(service).toBeTruthy();
  }));
});
