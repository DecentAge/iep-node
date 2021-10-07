import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockGenerationComponent } from './block-generation.component';

describe('BlockGenerationComponent', () => {
  let component: BlockGenerationComponent;
  let fixture: ComponentFixture<BlockGenerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockGenerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
