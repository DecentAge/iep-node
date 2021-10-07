import { TestBed, inject } from '@angular/core/testing';

import { OptionService } from './option.service';

describe('OptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptionService]
    });
  });

  it('should be created', inject([OptionService], (service: OptionService) => {
    expect(service).toBeTruthy();
  }));
});
