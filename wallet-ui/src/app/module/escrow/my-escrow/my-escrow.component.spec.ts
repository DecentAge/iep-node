import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEscrowComponent } from './my-escrow.component';

describe('MyEscrowComponent', () => {
  let component: MyEscrowComponent;
  let fixture: ComponentFixture<MyEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEscrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
