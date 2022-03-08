import { Injectable } from '@angular/core';

import { Mail } from '../models';

import { ElectronService } from '.';

@Injectable({
  providedIn: 'root',
})
export class PrintMailService {
  constructor(private electronService: ElectronService) {}

  printAllMailsOnElectron(mail: Mail, decryptedContents: any) {
    if (decryptedContents[mail.id]) {
      let mailHtml = '';
      mailHtml = this.getHTMLForMail(mail);
      if (mail.has_children) {
        mail.children.forEach((child: Mail) => {
          if (decryptedContents[child.id]) {
            mailHtml += this.getHTMLForMail(child, true);
          }
        });
      }

      const printHtml = this.getHtmlToPrint(mailHtml);
      this.electronService.printHtml(printHtml);
    }
  }

  getHtmlToPrint(content: string) {
    return `
        <html>
          <head>
            <title>Print tab</title>
            <style>
            body {
              font-family: "Roboto", Helvetica, Arial, sans-serif;
              }
              .navbar-brand-logo {
                  margin-right: 10px;
                  max-width: 32px;
              }
              a {
                  color: #3498db;
              }
              .container {
                  max-width: 900px;
                  padding: 100px 15px;
                  margin: auto;
                  color: #757675;
              }
              .row {
                  padding-left: -15px;
                  padding-right: -15px;
              }
              .text-center {
                  text-align: center;
              }
              .text-secondary {
                  color: #34495e;
              }
              .page-title {
                  font-weight: 300;
              }
              .dashed-separator {
                  border-top: 1px dashed #777;margin:20px 0 20px;
              }
            </style>
          </head>
          <body>
          <div class="container">
              ${content}
          </div>
          </body>
        </html>`;
  }

  getHTMLForMail(mail: Mail, isChild = false) {
    const subject = isChild ? '' : document.querySelector(`[id='${mail.id}-mail-subject']`)?.innerHTML;
    const from = document.querySelector(`[id='${mail.id}-mail-from']`)?.innerHTML;
    const to = document.querySelector(`[id='${mail.id}-mail-to']`)?.innerHTML;
    const date = document.querySelector(`[id='${mail.id}-mail-date']`)?.innerHTML;
    const content = document.querySelector(`[id='${mail.id}-raw-mail-content']`)?.innerHTML;
    const hasCC = document.querySelector(`[id='${mail.id}-mail-cc']`);
    let cc = '';
    if (hasCC) {
      cc = `<span class="text-muted">${hasCC?.innerHTML}</span>`;
    }

    return `
    <div class="row">
        <!-- Mail Subject -->
        ${isChild ? '' : `<h1>${subject}</h1>`}
        <div class="dashed-separator"></div>
        <!-- Mail From  -->
        <span class="text-muted">${from}</span>
        <br>
        <!-- Mail To  -->
        <span class="text-muted">${to}</span>
        <br>
        <!-- Mail CC  -->
        ${cc}
        <br>
        <!-- Mail Date Created  -->
        Dated:<strong>${date}</strong>
        <br>
        <div class="dashed-separator"></div>
        <!-- Mail Content  -->
        <div>
            ${content}
        </div>
    </div>`;
  }
}
