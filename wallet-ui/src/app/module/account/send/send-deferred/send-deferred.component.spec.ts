import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendDeferredComponent } from './send-deferred.component';

describe('SendDeferredComponent', () => {
  let component: SendDeferredComponent;
  let fixture: ComponentFixture<SendDeferredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendDeferredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendDeferredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
