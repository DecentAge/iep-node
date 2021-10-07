import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveFoundersComponent } from './reserve-founders.component';

describe('ReserveFoundersComponent', () => {
  let component: ReserveFoundersComponent;
  let fixture: ComponentFixture<ReserveFoundersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveFoundersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveFoundersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
