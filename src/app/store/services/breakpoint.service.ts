import { Injectable } from '@angular/core';

export interface Breakpoint {
  min?: number;
  max?: number;
}

export interface BreakpointConfig {
  [name: string]: Breakpoint;
}

export const defaultBreakpoints: BreakpointConfig = {
  xs: { max: 768 },
  sm: { min: 768, max: 992 },
  md: { min: 992, max: 1200 },
  lg: { min: 1200 }
};

@Injectable()
export class BreakpointsService {
  private breakpoints: BreakpointConfig = defaultBreakpoints;

  public getBreakpoint(): string {

    const currentSize: number = window.innerWidth;
    const keys = Object.keys(this.breakpoints);
    for (const key of keys) {
      const value = this.breakpoints[key];
      const min = value.min || 0;
      const max = value.max || Number.MAX_SAFE_INTEGER;

      if (currentSize >= min && currentSize < max) {
        return key;
      }
    }

    return null;
  }

  /**
   * @Description Returns true if the current layout is `sm`(small)
   * @returns {boolean}
   */
  public isSM() {
    return this.getBreakpoint() === 'sm';
  }

  /**
   * @Description Returns true if the current layout is `xs`(extra small)
   * @returns {boolean}
   */
  public isXS() {
    return this.getBreakpoint() === 'xs';
  }

  /**
   * @Description Returns true if the current layout is `md`(medium)
   * @returns {boolean}
   */
  public isMD() {
    return this.getBreakpoint() === 'md';
  }

  /**
   * @Description Returns true if the current layout is `lg`(large)
   * @returns {boolean}
   */
  public isLG() {
    return this.getBreakpoint() === 'lg';
  }
}
