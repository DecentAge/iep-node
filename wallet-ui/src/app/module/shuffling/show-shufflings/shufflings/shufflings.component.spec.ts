import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShufflingsComponent } from './shufflings.component';

describe('ShufflingsComponent', () => {
  let component: ShufflingsComponent;
  let fixture: ComponentFixture<ShufflingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShufflingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShufflingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
