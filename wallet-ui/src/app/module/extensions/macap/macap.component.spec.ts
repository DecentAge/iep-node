import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacapComponent } from './macap.component';

describe('MacapComponent', () => {
  let component: MacapComponent;
  let fixture: ComponentFixture<MacapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
