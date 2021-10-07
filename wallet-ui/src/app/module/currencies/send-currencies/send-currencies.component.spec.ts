import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCurrenciesComponent } from './send-currencies.component';

describe('SendCurrenciesComponent', () => {
  let component: SendCurrenciesComponent;
  let fixture: ComponentFixture<SendCurrenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCurrenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
