import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore  } from '@ngrx/store/testing';
import { AutocryptProcessService, ComposeMailService, MessageBuilderService, SharedService } from '../../../../store/services';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { GenericFolderComponent } from './generic-folder.component';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

describe('GenericFolderComponent', () => {
  let component: GenericFolderComponent;
  let fixture: ComponentFixture<GenericFolderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [GenericFolderComponent],
      providers: [provideMockStore({}), SharedService, MessageBuilderService, AutocryptProcessService, ComposeMailService, TranslateService, TranslateStore],
      imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, TranslateModule.forRoot()],
    }).compileComponents();
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
