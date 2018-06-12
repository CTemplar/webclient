// Angular
import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

// Ngxs
import { Select, Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-alerts",
  templateUrl: "./alerts.component.html",
  styleUrls: ["./alerts.component.scss"],
  animations: [
    trigger("animation", [
      state("in", style({ opacity: 1 })),
      transition(":enter", [style({ opacity: 0 }), animate(600)]),
      transition(":leave", animate(600, style({ opacity: 0 })))
    ])
  ]
})
export class AlertsComponent implements OnInit {
  @Select(state => state.layout.alerts)
  alerts$: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
