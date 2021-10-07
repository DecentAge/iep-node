import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlFundingMonitorComponent } from './control-funding-monitor.component';

describe('ControlFundingMonitorComponent', () => {
  let component: ControlFundingMonitorComponent;
  let fixture: ComponentFixture<ControlFundingMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlFundingMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlFundingMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
