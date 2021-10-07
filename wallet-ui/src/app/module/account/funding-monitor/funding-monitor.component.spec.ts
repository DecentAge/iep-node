import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingMonitorComponent } from './funding-monitor.component';

describe('FundingMonitorComponent', () => {
  let component: FundingMonitorComponent;
  let fixture: ComponentFixture<FundingMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
