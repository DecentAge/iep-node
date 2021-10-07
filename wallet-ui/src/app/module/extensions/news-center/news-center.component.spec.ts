import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCenterComponent } from './news-center.component';

describe('NewsCenterComponent', () => {
  let component: NewsCenterComponent;
  let fixture: ComponentFixture<NewsCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
