import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSectionComponent } from './password-section.component';

describe('PasswordSectionComponent', () => {
  let component: PasswordSectionComponent;
  let fixture: ComponentFixture<PasswordSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
