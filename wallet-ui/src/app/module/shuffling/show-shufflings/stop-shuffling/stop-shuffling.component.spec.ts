import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopShufflingComponent } from './stop-shuffling.component';

describe('StopShufflingComponent', () => {
  let component: StopShufflingComponent;
  let fixture: ComponentFixture<StopShufflingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopShufflingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopShufflingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
