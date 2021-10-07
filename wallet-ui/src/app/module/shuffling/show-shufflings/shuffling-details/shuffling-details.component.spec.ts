import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShufflingDetailsComponent } from './shuffling-details.component';

describe('ShufflingDetailsComponent', () => {
  let component: ShufflingDetailsComponent;
  let fixture: ComponentFixture<ShufflingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShufflingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShufflingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
