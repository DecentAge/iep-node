import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOpenOffersComponent } from './my-open-offers.component';

describe('MyOpenOffersComponent', () => {
  let component: MyOpenOffersComponent;
  let fixture: ComponentFixture<MyOpenOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOpenOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOpenOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
