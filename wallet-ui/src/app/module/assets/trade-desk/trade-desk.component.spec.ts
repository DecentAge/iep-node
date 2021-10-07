import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDeskComponent } from './trade-desk.component';

describe('TradeDeskComponent', () => {
  let component: TradeDeskComponent;
  let fixture: ComponentFixture<TradeDeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeDeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
