import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyOffersComponent } from './buy-offers.component';

describe('BuyOffersComponent', () => {
  let component: BuyOffersComponent;
  let fixture: ComponentFixture<BuyOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
