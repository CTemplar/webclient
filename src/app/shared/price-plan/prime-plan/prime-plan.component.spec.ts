import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimePlanComponent } from './prime-plan.component';

describe('PrimePlanComponent', () => {
  let component: PrimePlanComponent;
  let fixture: ComponentFixture<PrimePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
