import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowShufflingsComponent } from './show-shufflings.component';

describe('ShowShufflingsComponent', () => {
  let component: ShowShufflingsComponent;
  let fixture: ComponentFixture<ShowShufflingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowShufflingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowShufflingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
