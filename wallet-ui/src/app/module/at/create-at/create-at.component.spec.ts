import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAtComponent } from './create-at.component';

describe('CreateAtComponent', () => {
  let component: CreateAtComponent;
  let fixture: ComponentFixture<CreateAtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
