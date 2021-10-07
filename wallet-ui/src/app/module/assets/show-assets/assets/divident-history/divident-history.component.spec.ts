import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DividentHistoryComponent } from './divident-history.component';

describe('DividentHistoryComponent', () => {
  let component: DividentHistoryComponent;
  let fixture: ComponentFixture<DividentHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DividentHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DividentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
