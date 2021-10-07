import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateSignatureComponent } from './validate-signature.component';

describe('ValidateSignatureComponent', () => {
  let component: ValidateSignatureComponent;
  let fixture: ComponentFixture<ValidateSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
