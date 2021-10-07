import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAliasComponent } from './show-alias.component';

describe('ShowAliasComponent', () => {
  let component: ShowAliasComponent;
  let fixture: ComponentFixture<ShowAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
