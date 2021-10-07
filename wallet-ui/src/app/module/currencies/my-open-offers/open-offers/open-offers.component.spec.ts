import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOffersComponent } from './open-offers.component';

describe('OpenOffersComponent', () => {
  let component: OpenOffersComponent;
  let fixture: ComponentFixture<OpenOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
