import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPollsComponent } from './show-polls.component';

describe('ShowPollsComponent', () => {
  let component: ShowPollsComponent;
  let fixture: ComponentFixture<ShowPollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
