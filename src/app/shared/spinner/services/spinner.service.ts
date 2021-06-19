import { Injectable } from '@angular/core';

import { SpinnerComponent } from '../components/spinner.component';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerCache = new Set<SpinnerComponent>();

  register(spinner: SpinnerComponent): void {
    this.spinnerCache.add(spinner);
  }

  show(spinnerName: string): void {
    for (const spinner of this.spinnerCache) {
      if (spinner.name === spinnerName) {
        spinner.show = true;
      }
    }
  }

  hide(spinnerName: string): void {
    for (const spinner of this.spinnerCache) {
      if (spinner.name === spinnerName) {
        spinner.show = false;
      }
    }
  }

  showGroup(spinnerGroup: string): void {
    for (const spinner of this.spinnerCache) {
      if (spinner.group === spinnerGroup) {
        spinner.show = true;
      }
    }
  }

  hideGroup(spinnerGroup: string): void {
    for (const spinner of this.spinnerCache) {
      if (spinner.group === spinnerGroup) {
        spinner.show = false;
      }
    }
  }

  showAll(): void {
    for (const spinner of this.spinnerCache) spinner.show = true;
  }

  hideAll(): void {
    for (const spinner of this.spinnerCache) spinner.show = false;
  }

  isShowing(spinnerName: string): boolean | undefined {
    let showing;
    for (const spinner of this.spinnerCache) {
      if (spinner.name === spinnerName) {
        showing = spinner.show;
      }
    }

    return showing;
  }

  unregister(spinnerToRemove: SpinnerComponent): void {
    for (const spinner of this.spinnerCache) {
      if (spinner === spinnerToRemove) {
        this.spinnerCache.delete(spinner);
      }
    }
  }
}
