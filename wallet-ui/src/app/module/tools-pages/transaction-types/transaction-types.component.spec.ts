import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypesComponent } from './transaction-types.component';

describe('TransactionTypesComponent', () => {
  let component: TransactionTypesComponent;
  let fixture: ComponentFixture<TransactionTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
