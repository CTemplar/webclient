import { Component, OnInit, OnDestroy } from '@angular/core';

// Service
import { SharedService } from '../../core/providers';

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
    this.sharedService.hideFooter.emit(true);
  }


  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
