// Angular
import { Component } from "@angular/core";

// Ngxs
import { Select } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-footer",
  templateUrl: "./pages-footer.component.html",
  styleUrls: ["./pages-footer.component.scss"]
})
export class PagesFooterComponent {
  @Select(state => state.layout.showCallToAction)
  showCallToAction$: Observable<any>;
}
