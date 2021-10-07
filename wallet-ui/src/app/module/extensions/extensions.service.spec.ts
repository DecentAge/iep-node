import { TestBed, inject } from '@angular/core/testing';

import { ExtensionsService } from './extensions.service';

describe('ExtensionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtensionsService]
    });
  });

  it('should be created', inject([ExtensionsService], (service: ExtensionsService) => {
    expect(service).toBeTruthy();
  }));
});
