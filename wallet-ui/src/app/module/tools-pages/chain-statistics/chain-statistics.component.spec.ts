import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainStatisticsComponent } from './chain-statistics.component';

describe('ChainStatisticsComponent', () => {
  let component: ChainStatisticsComponent;
  let fixture: ComponentFixture<ChainStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
