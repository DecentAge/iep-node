import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendPaymentComponent } from './dividend-payment.component';

describe('DividendPaymentComponent', () => {
  let component: DividendPaymentComponent;
  let fixture: ComponentFixture<DividendPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividendPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividendPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
