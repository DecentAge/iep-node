import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShufflingComponent } from './create-shuffling.component';

describe('CreateShufflingComponent', () => {
  let component: CreateShufflingComponent;
  let fixture: ComponentFixture<CreateShufflingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateShufflingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateShufflingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
