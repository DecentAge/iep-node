import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDeskBuyAssetComponent } from './trade-desk-buy-asset.component';

describe('TradeDeskBuyAssetComponent', () => {
  let component: TradeDeskBuyAssetComponent;
  let fixture: ComponentFixture<TradeDeskBuyAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeDeskBuyAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeDeskBuyAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
