import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionsComponent } from './cancel-subscriptions.component';

describe('CancelSubscriptionsComponent', () => {
  let component: CancelSubscriptionsComponent;
  let fixture: ComponentFixture<CancelSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
