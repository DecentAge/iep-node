import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCampaignsComponent } from './show-campaigns.component';

describe('ShowCampaignsComponent', () => {
  let component: ShowCampaignsComponent;
  let fixture: ComponentFixture<ShowCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
