import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateStorageSectionComponent } from './allocate-storage-section.component';

describe('AllocateStorageSectionComponent', () => {
  let component: AllocateStorageSectionComponent;
  let fixture: ComponentFixture<AllocateStorageSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateStorageSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocateStorageSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
