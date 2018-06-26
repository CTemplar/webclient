import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

// Store
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// Store
import { AuthState } from '../../store/datatypes';
import { selectAuthState } from '../../store/selectors';
import { LogIn } from '../../store/actions';
import { FinalLoading } from '../../store/actions';

// Service
import { SharedService } from '../../store/services';

@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.scss']
})
export class DecryptComponent implements OnInit {

  errorMessage: string = '';
  isLoading: boolean = false;
  getState: Observable<any>;
  @ViewChild('messagePasswordInput') messagePasswordInput: ElementRef;

  constructor(
    private router: Router,
    private store: Store<AuthState>,
    private sharedService: SharedService,
  ) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    });

    this.sharedService.hideFooter.emit(true);

    this.sharedService.isExternalPage.emit(true);

    this.getState.subscribe(state => {
      this.isLoading = false;
      this.errorMessage = state.errorMessage;
    });
  }

  // == Toggle password visibility
  togglePassword(messagePasswordInput: any): any {
    if (!messagePasswordInput.value) {
      return;
    }
    messagePasswordInput.type = messagePasswordInput.type === 'password' ? 'text' : 'password';
  }

  ngOnDestroy() {
    this.sharedService.isExternalPage.emit(false);
  }

}
