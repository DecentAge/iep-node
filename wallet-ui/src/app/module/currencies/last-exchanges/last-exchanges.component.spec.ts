import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastExchangesComponent } from './last-exchanges.component';

describe('LastExchangesComponent', () => {
  let component: LastExchangesComponent;
  let fixture: ComponentFixture<LastExchangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastExchangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastExchangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
