import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationBriefSectionComponent } from './organization-brief-section.component';

describe('OrganizationBriefSectionComponent', () => {
  let component: OrganizationBriefSectionComponent;
  let fixture: ComponentFixture<OrganizationBriefSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationBriefSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationBriefSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
