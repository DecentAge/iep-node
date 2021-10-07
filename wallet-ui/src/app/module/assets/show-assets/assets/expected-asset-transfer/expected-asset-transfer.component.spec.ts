import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedAssetTransferComponent } from './expected-asset-transfer.component';

describe('ExpectedAssetTransferComponent', () => {
  let component: ExpectedAssetTransferComponent;
  let fixture: ComponentFixture<ExpectedAssetTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedAssetTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedAssetTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
