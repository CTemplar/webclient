import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AddMailboxKeys, ResetMailboxKeyOperationState, SnackErrorPush } from '../../../store';
import { Mailbox } from '../../../store/models';
import { AppState, MailBoxesState, MailboxKey, PlanType, UserState } from '../../../store/datatypes';
import { OpenPgpService, SharedService } from '../../../store/services';
import { BehaviorSubject } from 'rxjs';

enum ImportPrivateKeyStep {
  SELECT_MAILBOX,
  SELECT_PRIVATE_KEY,
  INPUT_PRIVATE_KEY_PASSWORD,
  INPUT_USER_PASSWORD,
}

@UntilDestroy()
@Component({
  selector: 'app-import-private-key',
  templateUrl: './import-private-key.component.html',
  styleUrls: ['./import-private-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportPrivateKeyComponent implements OnInit {
  @Input() mailboxes: Mailbox[] = [];

  selectedMailbox: Mailbox;

  ImportPrivateKeyStep = ImportPrivateKeyStep;

  currentStep: ImportPrivateKeyStep = ImportPrivateKeyStep.SELECT_MAILBOX;

  inProgress = false;

  currentFile: File;

  currentFileContent: string;

  passphrase: string;

  decryptError = false;

  password: string;

  mailboxKeyInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  mailboxKeyFailure$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  mailboxKeysMap: Map<number, Array<MailboxKey>>;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private openpgp: OpenPgpService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new ResetMailboxKeyOperationState());
    if (this.mailboxes.length > 0) {
      [this.selectedMailbox] = this.mailboxes;
    }
    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        if (
          !mailBoxesState.mailboxKeyInProgress &&
          this.mailboxKeyInProgress$.value &&
          !mailBoxesState.mailboxKeyFailure
        ) {
          this.activeModal.close();
        }

        this.mailboxKeyInProgress$.next(mailBoxesState.mailboxKeyInProgress);
        this.mailboxKeyFailure$.next(mailBoxesState.mailboxKeyFailure);
        this.mailboxKeysMap = mailBoxesState.mailboxKeysMap;
      });
  }

  onSelectMailbox(selectedMailbox: Mailbox) {
    this.selectedMailbox = selectedMailbox;
  }

  onSelectNewKeyFile(files: Array<File>) {
    if (files.length > 1) return;
    if (files && files.length > 0) {
      const file = files[0];
      this.inProgress = true;
      this.currentFile = Object.assign(file);
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.currentFileContent = event.target.result;
        this.openpgp
          .validatePrivateKey(this.currentFileContent)
          .pipe(take(1))
          .subscribe(
            data => {
              if (data.data?.fingerprint && this.mailboxKeysMap.has(this.selectedMailbox.id)) {
                const keys = this.mailboxKeysMap.get(this.selectedMailbox.id);
                if (keys.find(key => data.data.fingerprint === key.fingerprint)) {
                  this.store.dispatch(
                    new SnackErrorPush({
                      message: `${file.name} is already in active use`,
                    }),
                  );
                  this.currentFile = undefined;
                  this.currentFileContent = '';
                }
              } else {
                this.store.dispatch(
                  new SnackErrorPush({
                    message: `${file.name} is not a valid PGP Private Key`,
                  }),
                );
                this.currentFile = undefined;
                this.currentFileContent = '';
              }
              this.inProgress = false;
              this.cdr.detectChanges();
            },
            error => {
              this.store.dispatch(
                new SnackErrorPush({
                  message: `${file.name} is not a valid PGP Private Key`,
                }),
              );
              this.inProgress = false;
              this.currentFile = undefined;
              this.currentFileContent = '';
              this.cdr.detectChanges();
            },
          );
      });
      reader.readAsText(file);
    }
  }

  uploadImportedKey(keyData: any) {
    const { data } = keyData;
    if (keyData && this.selectedMailbox) {
      data.mailbox = this.selectedMailbox.id;
      let keyType = '';
      if (keyData.algorithmInfo) {
        keyType = keyData.algorithmInfo.bits ? `RSA${keyData.algorithmInfo.bits}` : keyData.algorithmInfo.curve;
      }
      data.key_type = keyType;
      delete data.algorithmInfo;
      data.password = this.sharedService.getHashPurePasswordWithUserName(this.password);
      //
      this.store.dispatch(new AddMailboxKeys(data));
    }
  }

  parsePrivateKey() {
    if (this.currentFile && this.passphrase) {
      this.decryptError = false;
      this.inProgress = true;
      this.openpgp
        .decryptPrivateKey(this.currentFileContent, this.passphrase)
        .pipe(take(1))
        .subscribe(
          data => {
            this.inProgress = false;
            this.decryptError = false;
            this.currentStep += 1;
            this.cdr.detectChanges();
          },
          error => {
            this.inProgress = false;
            this.decryptError = true;
            this.cdr.detectChanges();
          },
        );
    }
  }

  encryptWithCurrentPassword() {
    if (this.currentFileContent && this.password) {
      this.inProgress = true;
      this.openpgp
        .encryptPrivateKey(this.currentFileContent, this.password, this.passphrase)
        .pipe(take(1))
        .subscribe(
          data => {
            this.inProgress = false;
            this.uploadImportedKey(data);
            this.cdr.detectChanges();
          },
          error => {
            this.inProgress = false;
            this.cdr.detectChanges();
          },
        );
    }
  }

  onNext() {
    if (this.currentStep === ImportPrivateKeyStep.INPUT_PRIVATE_KEY_PASSWORD) {
      this.parsePrivateKey();
    } else if (this.currentStep === ImportPrivateKeyStep.INPUT_USER_PASSWORD) {
      this.encryptWithCurrentPassword();
    } else {
      this.currentStep += 1;
    }
  }

  onHide() {
    this.activeModal.close();
  }

  // == Toggle password visibility
  togglePassword(inputID: string): any {
    const input = <HTMLInputElement>document.getElementById(inputID);
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
