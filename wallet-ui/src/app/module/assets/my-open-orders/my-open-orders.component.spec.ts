import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOpenOrdersComponent } from './my-open-orders.component';

describe('MyOpenOrdersComponent', () => {
  let component: MyOpenOrdersComponent;
  let fixture: ComponentFixture<MyOpenOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOpenOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOpenOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
