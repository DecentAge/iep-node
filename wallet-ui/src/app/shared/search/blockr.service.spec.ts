import { TestBed, inject } from '@angular/core/testing';

import { BlockrService } from './blockr.service';

describe('BlockrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlockrService]
    });
  });

  it('should be created', inject([BlockrService], (service: BlockrService) => {
    expect(service).toBeTruthy();
  }));
});
