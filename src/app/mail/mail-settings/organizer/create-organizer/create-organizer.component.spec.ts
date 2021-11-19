import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrganizerComponent } from './create-organizer.component';

describe('CreateOrganizerComponent', () => {
  let component: CreateOrganizerComponent;
  let fixture: ComponentFixture<CreateOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrganizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
