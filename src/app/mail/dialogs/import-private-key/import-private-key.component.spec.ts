import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OpenPgpService } from '../../../store/services';
import { HttpClientModule } from '@angular/common/http';

import { ImportPrivateKeyComponent } from './import-private-key.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

describe('ImportPrivateKeyComponent', () => {
  let component: ImportPrivateKeyComponent;
  let fixture: ComponentFixture<ImportPrivateKeyComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ImportPrivateKeyComponent],
      imports: [
        NgbModule,
        HttpClientModule,
        RouterTestingModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        OpenPgpService,
        provideMockStore({}),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPrivateKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
