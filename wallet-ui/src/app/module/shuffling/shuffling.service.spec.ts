import { TestBed, inject } from '@angular/core/testing';

import { ShufflingService } from './shuffling.service';

describe('ShufflingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShufflingService]
    });
  });

  it('should be created', inject([ShufflingService], (service: ShufflingService) => {
    expect(service).toBeTruthy();
  }));
});
