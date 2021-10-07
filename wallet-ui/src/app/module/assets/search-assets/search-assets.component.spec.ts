import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAssetsComponent } from './search-assets.component';

describe('SearchAssetsComponent', () => {
  let component: SearchAssetsComponent;
  let fixture: ComponentFixture<SearchAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
