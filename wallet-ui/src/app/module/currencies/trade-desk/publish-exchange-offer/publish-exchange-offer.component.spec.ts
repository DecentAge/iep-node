import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishExchangeOfferComponent } from './publish-exchange-offer.component';

describe('PublishExchangeOfferComponent', () => {
  let component: PublishExchangeOfferComponent;
  let fixture: ComponentFixture<PublishExchangeOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishExchangeOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishExchangeOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
