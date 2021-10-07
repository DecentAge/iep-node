import { TestBed, inject } from '@angular/core/testing';

import { FeeService } from './fee.service';

describe('FeeServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeeService]
    });
  });

  it('should be created', inject([FeeService], (service: FeeService) => {
    expect(service).toBeTruthy();
  }));
});
