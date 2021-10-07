import { TestBed, inject } from '@angular/core/testing';

import { AliasesService } from './aliases.service';

describe('AliasesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AliasesService]
    });
  });

  it('should be created', inject([AliasesService], (service: AliasesService) => {
    expect(service).toBeTruthy();
  }));
});
