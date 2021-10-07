import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishExchangeBuyOfferComponent } from './publish-exchange-buy-offer.component';

describe('PublishExchangeBuyOfferComponent', () => {
  let component: PublishExchangeBuyOfferComponent;
  let fixture: ComponentFixture<PublishExchangeBuyOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishExchangeBuyOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishExchangeBuyOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
