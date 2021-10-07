import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAtsComponent } from './show-ats.component';

describe('ShowAtsComponent', () => {
  let component: ShowAtsComponent;
  let fixture: ComponentFixture<ShowAtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
