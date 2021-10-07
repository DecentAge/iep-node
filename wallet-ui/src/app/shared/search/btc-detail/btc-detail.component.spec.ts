import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtcDetailComponent } from './btc-detail.component';

describe('BtcDetailComponent', () => {
  let component: BtcDetailComponent;
  let fixture: ComponentFixture<BtcDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtcDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtcDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
