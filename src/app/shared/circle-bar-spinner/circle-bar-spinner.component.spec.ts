import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleBarSpinnerComponent } from './circle-bar-spinner.component';

describe('CircleBarSpinnerComponent', () => {
  let component: CircleBarSpinnerComponent;
  let fixture: ComponentFixture<CircleBarSpinnerComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [CircleBarSpinnerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleBarSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
