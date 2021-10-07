import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PollVotersComponent } from './poll-voters.component';

describe('PollVotersComponent', () => {
  let component: PollVotersComponent;
  let fixture: ComponentFixture<PollVotersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollVotersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollVotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
