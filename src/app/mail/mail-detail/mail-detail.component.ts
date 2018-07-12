import { Component, OnInit } from "@angular/core";
import { MailService } from "../../store/services/mail.service";
import { Mail } from "../../store/models/mail.model";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { GetMailDetail } from "../../store/actions/mail.actions";
import { Observable } from "rxjs/Observable";
import { getMailDetail } from "../../store/selectors";

@Component({
  selector: "app-mail-detail",
  templateUrl: "./mail-detail.component.html",
  styleUrls: ["./mail-detail.component.scss"]
})
export class MailDetailComponent implements OnInit {
  mail: Mail;
  getMailDetailState$: Observable<any>;
  readonly destroyed$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<any>) {
    this.getMailDetailState$ = this.store.select(getMailDetail);
  }

  ngOnInit() {
    this.getMailDetailState$.subscribe((mailDetail) => {
      if(mailDetail){
        this.mail = mailDetail[0];
      }
    });

    this.route.params.subscribe(params => {
      const id = +params["id"];
      this.getMailDetail(id);
    });
  }

  getMailDetail(messageId: number) {
    this.store.dispatch(new GetMailDetail(messageId));
  }
}
