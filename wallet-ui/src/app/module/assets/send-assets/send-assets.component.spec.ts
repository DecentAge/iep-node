import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendAssetsComponent } from './send-assets.component';

describe('SendAssetsComponent', () => {
  let component: SendAssetsComponent;
  let fixture: ComponentFixture<SendAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
