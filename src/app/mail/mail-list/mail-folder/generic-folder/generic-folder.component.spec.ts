import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericFolderComponent } from './generic-folder.component';

describe('GenericFolderComponent', () => {
  let component: GenericFolderComponent;
  let fixture: ComponentFixture<GenericFolderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GenericFolderComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
