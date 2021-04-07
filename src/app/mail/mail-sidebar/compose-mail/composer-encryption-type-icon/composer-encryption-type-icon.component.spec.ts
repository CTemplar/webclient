import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposerEncryptionTypeIconComponent } from './composer-encryption-type-icon.component';

describe('ComposerEncryptionTypeIconComponent', () => {
  let component: ComposerEncryptionTypeIconComponent;
  let fixture: ComponentFixture<ComposerEncryptionTypeIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComposerEncryptionTypeIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposerEncryptionTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
