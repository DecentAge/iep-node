import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCurrencyComponent } from './transfer-currency.component';

describe('TransferCurrencyComponent', () => {
  let component: TransferCurrencyComponent;
  let fixture: ComponentFixture<TransferCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
