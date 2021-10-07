import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAssetsComponent } from './show-assets.component';

describe('ShowAssetsComponent', () => {
  let component: ShowAssetsComponent;
  let fixture: ComponentFixture<ShowAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
