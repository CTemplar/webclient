import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Service
import { SharedService } from '../../shared/shared.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-users-billing-info',
  templateUrl: './users-billing-info.component.html',
  styleUrls: ['./users-billing-info.component.scss']
})
export class UsersBillingInfoComponent implements OnDestroy, OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.hideFooterCallToAction.emit(true);
  }


  ngOnDestroy() {
    this.sharedService.hideFooterCallToAction.emit(false);
  }
}
