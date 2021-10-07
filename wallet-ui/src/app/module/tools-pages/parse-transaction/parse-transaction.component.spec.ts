import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseTransactionComponent } from './parse-transaction.component';

describe('ParseTransactionComponent', () => {
  let component: ParseTransactionComponent;
  let fixture: ComponentFixture<ParseTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParseTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
