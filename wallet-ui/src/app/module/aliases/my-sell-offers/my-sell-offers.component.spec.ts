import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySellOffersComponent } from './my-sell-offers.component';

describe('MySellOffersComponent', () => {
  let component: MySellOffersComponent;
  let fixture: ComponentFixture<MySellOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySellOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySellOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
