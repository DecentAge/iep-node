import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSimpleComponent } from './send-simple.component';

describe('SendSimpleComponent', () => {
  let component: SendSimpleComponent;
  let fixture: ComponentFixture<SendSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
