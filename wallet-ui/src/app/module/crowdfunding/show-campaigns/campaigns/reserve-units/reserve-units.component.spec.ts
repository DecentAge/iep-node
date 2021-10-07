import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveUnitsComponent } from './reserve-units.component';

describe('ReserveUnitsComponent', () => {
  let component: ReserveUnitsComponent;
  let fixture: ComponentFixture<ReserveUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
