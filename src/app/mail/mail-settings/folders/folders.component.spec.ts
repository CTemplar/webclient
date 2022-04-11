import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FoldersComponent } from './folders.component';

describe('FoldersComponent', () => {
  let component: FoldersComponent;
  let fixture: ComponentFixture<FoldersComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FoldersComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
