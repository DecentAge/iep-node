import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyAliasComponent } from './buy-alias.component';

describe('BuyAliasComponent', () => {
  let component: BuyAliasComponent;
  let fixture: ComponentFixture<BuyAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyAliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
