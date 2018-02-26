// Angular
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
export class MailSettingsComponent implements OnInit, AfterViewInit {

  private fragment: string;

  constructor(
    public modalService: SuiModalService,
    private mailService: MailService,
    private route: ActivatedRoute,
  ) {}

  // Selects
  language = 'English (USA)';
  timeZone = 'UTC+1 (Italy, Germany)';
  email = 'johnsimpson@ctemplar.com';

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
    this.route.fragment.subscribe(f => {
      const element = document.querySelector('#' + f);
      if (element) {
        element.scrollIntoView();
      }
    });
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) { }
  }

}
