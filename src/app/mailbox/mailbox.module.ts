// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Component
import { MailboxComponent } from "./mailbox.component";

// Modules
import { MailboxRoutingModule } from "./mailbox-routing.module";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [CommonModule, MailboxRoutingModule],
  declarations: [MailboxComponent]
})
export class MailboxModule {}
