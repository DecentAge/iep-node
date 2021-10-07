import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDeskBuyComponent } from './trade-desk-buy.component';

describe('TradeDeskBuyComponent', () => {
  let component: TradeDeskBuyComponent;
  let fixture: ComponentFixture<TradeDeskBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeDeskBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeDeskBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
