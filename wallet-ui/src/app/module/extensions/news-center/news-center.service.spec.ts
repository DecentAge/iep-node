import { TestBed, inject } from '@angular/core/testing';

import { NewsCenterService } from './news-center.service';

describe('NewsCenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsCenterService]
    });
  });

  it('should be created', inject([NewsCenterService], (service: NewsCenterService) => {
    expect(service).toBeTruthy();
  }));
});
