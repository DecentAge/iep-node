import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyExchangesComponent } from './my-exchanges.component';

describe('MyExchangesComponent', () => {
  let component: MyExchangesComponent;
  let fixture: ComponentFixture<MyExchangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyExchangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyExchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
