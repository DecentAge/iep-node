import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTradeDetailsComponent } from './order-trade-details.component';

describe('OrderTradeDetailsComponent', () => {
  let component: OrderTradeDetailsComponent;
  let fixture: ComponentFixture<OrderTradeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTradeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTradeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
