import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSharesComponent } from './delete-shares.component';

describe('DeleteSharesComponent', () => {
  let component: DeleteSharesComponent;
  let fixture: ComponentFixture<DeleteSharesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSharesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSharesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
