import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFeesComponent } from './service-fees.component';

describe('ServiceFeesComponent', () => {
  let component: ServiceFeesComponent;
  let fixture: ComponentFixture<ServiceFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
