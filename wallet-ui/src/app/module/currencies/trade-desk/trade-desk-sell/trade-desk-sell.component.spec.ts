import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDeskSellComponent } from './trade-desk-sell.component';

describe('TradeDeskSellComponent', () => {
  let component: TradeDeskSellComponent;
  let fixture: ComponentFixture<TradeDeskSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeDeskSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeDeskSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
