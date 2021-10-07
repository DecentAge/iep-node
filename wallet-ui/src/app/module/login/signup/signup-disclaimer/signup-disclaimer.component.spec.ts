import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupDisclaimerComponent } from './signup-disclaimer.component';

describe('SignupDisclaimerComponent', () => {
  let component: SignupDisclaimerComponent;
  let fixture: ComponentFixture<SignupDisclaimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupDisclaimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
