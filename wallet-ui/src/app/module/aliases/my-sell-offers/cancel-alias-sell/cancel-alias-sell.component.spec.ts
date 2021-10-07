import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelAliasSellComponent } from './cancel-alias-sell.component';

describe('CancelAliasSellComponent', () => {
  let component: CancelAliasSellComponent;
  let fixture: ComponentFixture<CancelAliasSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelAliasSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelAliasSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
