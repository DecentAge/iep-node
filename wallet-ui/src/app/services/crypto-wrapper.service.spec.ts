import { TestBed, inject } from '@angular/core/testing';

import { CryptoWrapperService } from './crypto-wrapper.service';

describe('CryptoWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CryptoWrapperService]
    });
  });

  it('should be created', inject([CryptoWrapperService], (service: CryptoWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
