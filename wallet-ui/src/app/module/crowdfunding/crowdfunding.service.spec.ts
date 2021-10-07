import { TestBed, inject } from '@angular/core/testing';

import { CrowdfundingService } from './crowdfunding.service';

describe('CrowdfundingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrowdfundingService]
    });
  });

  it('should be created', inject([CrowdfundingService], (service: CrowdfundingService) => {
    expect(service).toBeTruthy();
  }));
});
