import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { SnackErrorPush } from '../../../store';
import { Mailbox } from '../../../store/models';
import { AppState } from '../../../store/datatypes';
import { OpenPgpService } from '../../../store/services';

enum ImportPrivateKeyStep {
  SELECT_MAILBOX,
  SELECT_PRIVATE_KEY,
  INPUT_PRIVATE_KEY_PASSWORD,
  INPUT_USER_PASSWORD,
}

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

  decryptedPrivateKey: any;

  decryptError = false;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private openpgp: OpenPgpService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.mailboxes.length > 0) {
      [this.selectedMailbox] = this.mailboxes;
    }
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
            this.decryptedPrivateKey = data;
            this.decryptError = false;
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

  onNext() {
    if (this.currentStep === ImportPrivateKeyStep.INPUT_PRIVATE_KEY_PASSWORD) {
      this.parsePrivateKey();
    } else if (this.currentStep !== ImportPrivateKeyStep.INPUT_USER_PASSWORD) {
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
