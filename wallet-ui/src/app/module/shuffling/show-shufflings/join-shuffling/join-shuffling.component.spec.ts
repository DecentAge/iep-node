import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinShufflingComponent } from './join-shuffling.component';

describe('JoinShufflingComponent', () => {
  let component: JoinShufflingComponent;
  let fixture: ComponentFixture<JoinShufflingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinShufflingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinShufflingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
