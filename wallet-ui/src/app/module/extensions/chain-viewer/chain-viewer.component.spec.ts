import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainViewerComponent } from './chain-viewer.component';

describe('ChainViewerComponent', () => {
  let component: ChainViewerComponent;
  let fixture: ComponentFixture<ChainViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
