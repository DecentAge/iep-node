import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartShufflingComponent } from './start-shuffling.component';

describe('StartShufflingComponent', () => {
  let component: StartShufflingComponent;
  let fixture: ComponentFixture<StartShufflingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartShufflingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartShufflingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
