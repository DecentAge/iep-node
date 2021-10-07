import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCurrencyComponent } from './issue-currency.component';

describe('IssueCurrencyComponent', () => {
  let component: IssueCurrencyComponent;
  let fixture: ComponentFixture<IssueCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
