import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAssetComponent } from './issue-asset.component';

describe('IssueAssetComponent', () => {
  let component: IssueAssetComponent;
  let fixture: ComponentFixture<IssueAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
