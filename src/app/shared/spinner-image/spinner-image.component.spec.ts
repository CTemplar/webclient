import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerImageComponent } from './spinner-image.component';

describe('SpinnerImageComponent', () => {
  let component: SpinnerImageComponent;
  let fixture: ComponentFixture<SpinnerImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerImageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
