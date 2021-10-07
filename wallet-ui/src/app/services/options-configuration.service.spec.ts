import { TestBed, inject } from '@angular/core/testing';

import { OptionsConfigurationService } from './options-configuration.service';

describe('OptionsConfigurationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptionsConfigurationService]
    });
  });

  it('should be created', inject([OptionsConfigurationService], (service: OptionsConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
