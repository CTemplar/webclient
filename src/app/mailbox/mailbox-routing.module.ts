// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { MailboxComponent } from "./mailbox.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { MessageComponent } from "./message/message.component";
import { MessagesComponent } from "./messages/messages.component";
import { SettingsComponent } from "./settings/settings.component";

// Guards
import { AuthGuard } from "../app-store/guards";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const routes: Routes = [
  {
    path: "mailbox",
    canActivate: [AuthGuard],
    component: MailboxComponent,
    children: [
      { path: "", redirectTo: "inbox", pathMatch: "full" },
      { path: "settings", component: SettingsComponent },
      { path: "contacts", component: ContactsComponent },
      { path: "inbox", component: MessagesComponent },
      { path: "message", component: MessageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailboxRoutingModule {}
