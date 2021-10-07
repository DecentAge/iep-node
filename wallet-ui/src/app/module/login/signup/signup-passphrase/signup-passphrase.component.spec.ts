import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPassphraseComponent } from './signup-passphrase.component';

describe('SignupPassphraseComponent', () => {
  let component: SignupPassphraseComponent;
  let fixture: ComponentFixture<SignupPassphraseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPassphraseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPassphraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
