import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedOrderCancellationComponent } from './expected-order-cancellation.component';

describe('ExpectedOrderCancellationComponent', () => {
  let component: ExpectedOrderCancellationComponent;
  let fixture: ComponentFixture<ExpectedOrderCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedOrderCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedOrderCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
