import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountComponent } from './search-account.component';

describe('SearchAccountComponent', () => {
  let component: SearchAccountComponent;
  let fixture: ComponentFixture<SearchAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
