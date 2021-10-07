import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockTransactionDetailsComponent } from './block-transaction-details.component';

describe('BlockTransactionDetailsComponent', () => {
  let component: BlockTransactionDetailsComponent;
  let fixture: ComponentFixture<BlockTransactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockTransactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
