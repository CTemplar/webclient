import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageDropdownComponent } from './storage-dropdown.component';

describe('StorageDropdownComponent', () => {
  let component: StorageDropdownComponent;
  let fixture: ComponentFixture<StorageDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
