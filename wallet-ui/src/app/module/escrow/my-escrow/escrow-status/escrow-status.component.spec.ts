import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscrowStatusComponent } from './escrow-status.component';

describe('EscrowStatusComponent', () => {
  let component: EscrowStatusComponent;
  let fixture: ComponentFixture<EscrowStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscrowStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscrowStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
