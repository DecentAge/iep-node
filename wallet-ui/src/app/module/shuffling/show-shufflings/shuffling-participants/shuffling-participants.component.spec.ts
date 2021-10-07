import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShufflingParticipantsComponent } from './shuffling-participants.component';

describe('ShufflingParticipantsComponent', () => {
  let component: ShufflingParticipantsComponent;
  let fixture: ComponentFixture<ShufflingParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShufflingParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShufflingParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
