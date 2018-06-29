import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// Store
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
// Store
import { AppState } from '../../store/datatypes';
import { FinalLoading } from '../../store/actions';
// Service
import { SharedService } from '../../store/services';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
  selector: 'app-decrypt',
  templateUrl: './decrypt.component.html',
  styleUrls: ['./decrypt.component.scss']
})
export class DecryptComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  errorMessage: string = '';
  isLoading: boolean = false;
  @ViewChild('messagePasswordInput') messagePasswordInput: ElementRef;

  constructor(private router: Router,
              private store: Store<AppState>,
              private sharedService: SharedService) {}

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
