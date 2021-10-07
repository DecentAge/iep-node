import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedOrderDetailsComponent } from './expected-order-details.component';

describe('ExpectedOrderDetailsComponent', () => {
  let component: ExpectedOrderDetailsComponent;
  let fixture: ComponentFixture<ExpectedOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
