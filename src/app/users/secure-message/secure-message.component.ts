import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Bootstrap
import {NgbModal, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-secure-message',
  templateUrl: './secure-message.component.html',
  styleUrls: ['./secure-message.component.scss']
})
export class SecureMessageComponent implements OnInit {
  
  public replyInProcess: boolean = false;

  errorMessage: string = '';
  isLoading: boolean = false;
  getState: Observable<any>;	

  constructor(
  	private router: Router,
  	private store: Store<AuthState>,
  	private sharedService: SharedService,
    config: NgbDropdownConfig
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = "outside";
  	this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
  	setTimeout(() => {
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    });

    this.sharedService.hideFooter.emit(true);

    this.getState.subscribe(state => {
      this.isLoading = false;
      this.errorMessage = state.errorMessage;
    });
  }

  toggleReplyWindow():any {
    const bool = this.replyInProcess;
    this.replyInProcess = bool === false ? true : false;
  }

}
