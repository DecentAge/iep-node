import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessorsComponent } from './lessors.component';

describe('LessorsComponent', () => {
  let component: LessorsComponent;
  let fixture: ComponentFixture<LessorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
