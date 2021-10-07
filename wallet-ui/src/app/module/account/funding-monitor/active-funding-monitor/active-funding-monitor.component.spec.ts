import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFundingMonitorComponent } from './active-funding-monitor.component';

describe('ActiveFundingMonitorComponent', () => {
  let component: ActiveFundingMonitorComponent;
  let fixture: ComponentFixture<ActiveFundingMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveFundingMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveFundingMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
