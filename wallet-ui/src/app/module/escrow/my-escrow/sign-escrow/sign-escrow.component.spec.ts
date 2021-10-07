import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignEscrowComponent } from './sign-escrow.component';

describe('SignEscrowComponent', () => {
  let component: SignEscrowComponent;
  let fixture: ComponentFixture<SignEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignEscrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
