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
      // { path: "", redirectTo: "inbox/page/1", pathMatch: "full" },
      { path: ":folder", redirectTo: ":folder/page/1", pathMatch: "full" },
      { path: ":folder/page/:page", component: MessagesComponent },
      { path: "contact", component: ContactsComponent },
      { path: "message/:id", component: MessageComponent },
      { path: "settings", component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailboxRoutingModule {}
