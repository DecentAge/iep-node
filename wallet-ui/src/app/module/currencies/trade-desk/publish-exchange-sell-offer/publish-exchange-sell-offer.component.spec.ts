import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishExchangeSellOfferComponent } from './publish-exchange-sell-offer.component';

describe('PublishExchangeSellOfferComponent', () => {
  let component: PublishExchangeSellOfferComponent;
  let fixture: ComponentFixture<PublishExchangeSellOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishExchangeSellOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishExchangeSellOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
