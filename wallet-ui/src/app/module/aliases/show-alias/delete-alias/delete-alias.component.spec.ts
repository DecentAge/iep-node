import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAliasComponent } from './delete-alias.component';

describe('DeleteAliasComponent', () => {
  let component: DeleteAliasComponent;
  let fixture: ComponentFixture<DeleteAliasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAliasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
