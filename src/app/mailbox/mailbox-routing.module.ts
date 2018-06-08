// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { MailboxComponent } from "./mailbox.component";

// Guards
import { AuthGuard } from "../app-store/guards";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const routes: Routes = [
  {
    path: "mailbox",
    canActivate: [AuthGuard],
    component: MailboxComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailboxRoutingModule {}
