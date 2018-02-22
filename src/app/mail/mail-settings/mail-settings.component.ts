// Angular
import { Component, OnInit } from '@angular/core';

// Modals
import { BlacklistModal } from './modals/blacklist/blacklist.component';
import { CustomFilterModal } from './modals/custom-filter/custom-filter.component';
import { MakeADonationModal } from './modals/make-a-donation/make-a-donation.component';
import { PaymentMethodModal } from './modals/payment-method/payment-method.component';
import { WhitelistModal } from './modals/whitelist/whitelist.component';

// Services
import { MailService } from '../shared/mail.service';
import { SuiModalService } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit {

  constructor(
    public modalService: SuiModalService,
    private mailService: MailService,
  ) {}

  addCustomFilter() {
    this.modalService.open(new CustomFilterModal());
  }

  addWhitelistContact() {
    this.modalService.open(new WhitelistModal());
  }

  addBlacklistContact() {
    this.modalService.open(new BlacklistModal());
  }

  addPaymentMethod() {
    this.modalService.open(new PaymentMethodModal());
  }

  makeADonation() {
    this.modalService.open(new MakeADonationModal());
  }

  ngOnInit() {
  }

}
