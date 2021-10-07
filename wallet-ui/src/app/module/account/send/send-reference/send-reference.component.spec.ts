import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReferenceComponent } from './send-reference.component';

describe('SendReferenceComponent', () => {
  let component: SendReferenceComponent;
  let fixture: ComponentFixture<SendReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
