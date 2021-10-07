import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTransactionsComponent } from './completed-transactions.component';

describe('CompletedTransactionsComponent', () => {
  let component: CompletedTransactionsComponent;
  let fixture: ComponentFixture<CompletedTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
