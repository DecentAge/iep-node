import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlApproveComponent } from './control-approve.component';

describe('ControlApproveComponent', () => {
  let component: ControlApproveComponent;
  let fixture: ComponentFixture<ControlApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
