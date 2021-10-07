import { TestBed, inject } from '@angular/core/testing';

import { LocalhostService } from './localhost.service';

describe('LocalhostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalhostService]
    });
  });

  it('should be created', inject([LocalhostService], (service: LocalhostService) => {
    expect(service).toBeTruthy();
  }));
});
