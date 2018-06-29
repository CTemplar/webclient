import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
// Store
import { AppState } from '../../store/datatypes';
import { FinalLoading } from '../../store/actions';
// Service
import { SharedService } from '../../store/services';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-secure-message',
  templateUrl: './secure-message.component.html',
  styleUrls: ['./secure-message.component.scss']
})
export class SecureMessageComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  // == Public property to check if reply secure message window opened
  public isReplyWindowOpen: boolean = false;

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router,
              private store: Store<AppState>,
              private sharedService: SharedService,
              config: NgbDropdownConfig) {
    // == customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    });

    this.sharedService.hideFooter.emit(true);

    this.sharedService.isExternalPage.emit(true);

    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe(state => {
        this.isLoading = false;
        this.errorMessage = state.errorMessage;
      });
  }

  openReplyWindow() {
    const bool = this.isReplyWindowOpen;
    this.isReplyWindowOpen = true;
  }

  closeReplyWindow() {
    const bool = this.isReplyWindowOpen;
    this.isReplyWindowOpen = false;
  }

  ngOnDestroy() {
    this.sharedService.isExternalPage.emit(false);
  }

}
