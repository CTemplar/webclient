import { Component, OnInit, HostBinding } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  animateChild,
} from '@angular/animations';

@Component({
  selector: 'app-user-account-init-dialog',
  templateUrl: './user-account-init-dialog.component.html',
  styleUrls: ['./user-account-init-dialog.component.scss'],
  providers: [],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('.info-box2', style({opacity: 0})),
        query('.info-box3', style({opacity: 0})),
        query('.info-box4', style({opacity: 0})),
        query('@pageAnimation1', animateChild()),
        query('.info-box2', style({opacity: 1})),
        query('@pageAnimation2', animateChild()),
        query('.info-box3', style({opacity: 1})),
        query('@pageAnimation3', animateChild()),
        query('.info-box4', style({opacity: 1})),
        query('@pageAnimation4', animateChild()),
      ])
    ]),
    trigger('pageAnimation1', [
      transition(':enter', [
        query('.animated1', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation2', [
      transition(':enter', [
        query('.animated2', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation3', [
      transition(':enter', [
        query('.animated3', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation4', [
      transition(':enter', [
        query('.animated4', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ])
  ]
})
export class UserAccountInitDialogComponent implements OnInit {
  @HostBinding('@pageAnimations')
  public animatePage = true;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
