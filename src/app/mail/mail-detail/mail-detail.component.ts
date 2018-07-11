import { Component, OnInit } from "@angular/core";
import { MailService } from "../../store/services/mail.service";
import { Mail } from "../../store/models/mail.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-mail-detail",
  templateUrl: "./mail-detail.component.html",
  styleUrls: ["./mail-detail.component.scss"]
})
export class MailDetailComponent implements OnInit {
  mail: Mail;

  constructor(
    private mailService: MailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params["id"];
      this.mailService.getMessage(id).subscribe(res => {
        this.mail = res[0];
      });
    });
  }
}
