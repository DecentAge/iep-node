import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateHashComponent } from './calculate-hash.component';

describe('CalculateHashComponent', () => {
  let component: CalculateHashComponent;
  let fixture: ComponentFixture<CalculateHashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculateHashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateHashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
