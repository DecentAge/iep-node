import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCurrenciesComponent } from './search-currencies.component';

describe('SearchCurrenciesComponent', () => {
  let component: SearchCurrenciesComponent;
  let fixture: ComponentFixture<SearchCurrenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchCurrenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCurrenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
