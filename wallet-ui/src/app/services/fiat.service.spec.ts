import { TestBed, inject } from '@angular/core/testing';

import { FiatService } from './fiat.service';

describe('FiatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiatService]
    });
  });

  it('should be created', inject([FiatService], (service: FiatService) => {
    expect(service).toBeTruthy();
  }));
});
