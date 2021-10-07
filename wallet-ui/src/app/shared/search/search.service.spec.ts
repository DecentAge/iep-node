import { TestBed, inject } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});
