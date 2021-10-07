import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtDetailsComponent } from './at-details.component';

describe('AtDetailsComponent', () => {
  let component: AtDetailsComponent;
  let fixture: ComponentFixture<AtDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
