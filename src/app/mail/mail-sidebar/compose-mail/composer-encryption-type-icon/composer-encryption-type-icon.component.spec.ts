import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';

import { ComposerEncryptionTypeIconComponent } from './composer-encryption-type-icon.component';

describe('ComposerEncryptionTypeIconComponent', () => {
  let component: ComposerEncryptionTypeIconComponent;
  let fixture: ComponentFixture<ComposerEncryptionTypeIconComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ComposerEncryptionTypeIconComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, MatSnackBarModule],
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
