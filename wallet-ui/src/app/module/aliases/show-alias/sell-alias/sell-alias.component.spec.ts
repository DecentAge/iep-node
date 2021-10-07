import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAliasComponent } from './sell-alias.component';

describe('SellAliasComponent', () => {
  let component: SellAliasComponent;
  let fixture: ComponentFixture<SellAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellAliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
