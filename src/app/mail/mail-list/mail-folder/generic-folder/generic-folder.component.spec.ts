import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericFolderComponent } from './generic-folder.component';

describe('GenericFolderComponent', () => {
  let component: GenericFolderComponent;
  let fixture: ComponentFixture<GenericFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
