import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEscrowComponent } from './create-escrow.component';

describe('CreateEscrowComponent', () => {
  let component: CreateEscrowComponent;
  let fixture: ComponentFixture<CreateEscrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEscrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
