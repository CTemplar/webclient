import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// Store
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
// Store
import { AppState } from '../../store/datatypes';
// Service
import { SharedService } from '../../store/services';

@TakeUntilDestroy()
@Component({
  selector: 'app-decrypt-message',
  templateUrl: './decrypt-message.component.html',
  styleUrls: ['./decrypt-message.component.scss']
})
export class DecryptMessageComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  decryptForm: FormGroup;
  showFormErrors: boolean;
  errorMessage: string;
  isLoading: boolean;

  private hash: string;
  private secret: string;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService) {
  }

  ngOnInit() {
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isExternalPage.emit(true);

    this.decryptForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });

    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.hash = params['hash'];
      this.secret = params['secret'];
    });

    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe(state => {
        this.isLoading = false;
        this.errorMessage = state.errorMessage;
      });
  }

  ngOnDestroy() {
    this.sharedService.hideEntireFooter.emit(false);
    this.sharedService.isExternalPage.emit(false);
  }

  onSubmit(data: any) {
    this.showFormErrors = true;
    if (this.decryptForm.valid) {
      this.isLoading = true;
    }
  }

}
