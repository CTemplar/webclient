import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore  } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { UsersSignUpComponent } from './users-sign-up.component';
import { FinalLoading } from '../../store/actions';

describe('UsersSignUpComponent', () => {
  let component: UsersSignUpComponent;
  let fixture: ComponentFixture<UsersSignUpComponent>;
  let mockStore: MockStore;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [UsersSignUpComponent],
      providers: [provideMockStore({})],
      imports: [HttpClientModule, RouterTestingModule, MatSnackBarModule, TranslateModule.forRoot()],
    }).compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSignUpComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', inject([Store], (store: any) => {    
    expect(store).toBeTruthy();
  }));  

  it('should dispatch FinalLoading action', () => {
    const expectedAction = new FinalLoading({ loadingState: false })
    const dispatchSpy = spyOn(mockStore, 'dispatch').and.callThrough();
    mockStore.dispatch(expectedAction);
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(expectedAction)
  });
});
