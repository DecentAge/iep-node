import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSignatureComponent } from './generate-signature.component';

describe('GenerateSignatureComponent', () => {
  let component: GenerateSignatureComponent;
  let fixture: ComponentFixture<GenerateSignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateSignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
