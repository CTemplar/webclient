// Angular
import { NgModule } from "@angular/core";

// Component
import { MailboxComponent } from "./mailbox.component";
import { ComposerComponent } from "./composer/composer.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { MessageComponent } from "./message/message.component";
import { MessagesComponent } from "./messages/messages.component";
import { MessagesBarComponent } from "./messages-bar/messages-bar.component";
import { SettingsComponent } from "./settings/settings.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

// Modules
import { MailboxRoutingModule } from "./mailbox-routing.module";
import { SharedModule } from "../shared/shared.module";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [MailboxRoutingModule, SharedModule],
  declarations: [
    MailboxComponent,
    ComposerComponent,
    ContactsComponent,
    FooterComponent,
    HeaderComponent,
    MessageComponent,
    MessagesComponent,
    MessagesBarComponent,
    SettingsComponent,
    SidebarComponent
  ]
})
export class MailboxModule {}
