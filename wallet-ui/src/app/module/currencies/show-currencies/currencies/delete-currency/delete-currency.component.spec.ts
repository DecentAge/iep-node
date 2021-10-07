import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCurrencyComponent } from './delete-currency.component';

describe('DeleteCurrencyComponent', () => {
  let component: DeleteCurrencyComponent;
  let fixture: ComponentFixture<DeleteCurrencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCurrencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
