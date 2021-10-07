import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAliasComponent } from './create-alias.component';

describe('CreateAliasComponent', () => {
  let component: CreateAliasComponent;
  let fixture: ComponentFixture<CreateAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
