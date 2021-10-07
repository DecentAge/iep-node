import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupConfirmComponent } from './signup-confirm.component';

describe('SignupConfirmComponent', () => {
  let component: SignupConfirmComponent;
  let fixture: ComponentFixture<SignupConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
