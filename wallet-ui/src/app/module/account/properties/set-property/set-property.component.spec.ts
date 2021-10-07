import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPropertyComponent } from './set-property.component';

describe('SetPropertyComponent', () => {
  let component: SetPropertyComponent;
  let fixture: ComponentFixture<SetPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
