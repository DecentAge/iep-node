import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceLeaseComponent } from './balance-lease.component';

describe('BalanceLeaseComponent', () => {
  let component: BalanceLeaseComponent;
  let fixture: ComponentFixture<BalanceLeaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceLeaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceLeaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
