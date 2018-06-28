import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Inject, Injectable, LOCALE_ID, Optional, SkipSelf } from '@angular/core';

import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardContainerComponent } from '../components/keyboard-container/keyboard-container.component';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MAT_KEYBOARD_LAYOUTS } from '../configs/keyboard-layouts.config';
import { MatKeyboardConfig } from '../configs/keyboard.config';
import { IKeyboardLayout } from '../interfaces/keyboard-layout.interface';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';
import { ILocaleMap } from '../interfaces/locale-map.interface';
import { _applyAvailableLayouts, _applyConfigDefaults } from '../utils/keyboard.utils';

/**
 * Service to dispatch Material Design keyboard.
 */
@Injectable()
export class MatKeyboardService {
  /**
   * Reference to the current keyboard in the view *at this level* (in the Angular injector tree).
   * If there is a parent keyboard service, all operations should delegate to that parent
   * via `_openedKeyboardRef`.
   */
  private _keyboardRefAtThisLevel: MatKeyboardRef<MatKeyboardComponent> | null = null;

  private _availableLocales: ILocaleMap = {};

  /** Reference to the currently opened keyboard at *any* level. */
  private get _openedKeyboardRef(): MatKeyboardRef<MatKeyboardComponent> | null {
    const parent = this._parentKeyboard;
    return parent ? parent._openedKeyboardRef : this._keyboardRefAtThisLevel;
  }

  private set _openedKeyboardRef(value: MatKeyboardRef<MatKeyboardComponent>) {
    if (this._parentKeyboard) {
      this._parentKeyboard._openedKeyboardRef = value;
    } else {
      this._keyboardRefAtThisLevel = value;
    }
  }

  get availableLocales(): ILocaleMap {
    return this._availableLocales;
  }

  get isOpened(): boolean {
    return !!this._openedKeyboardRef;
  }

  constructor(private _overlay: Overlay,
              private _live: LiveAnnouncer,
              @Inject(LOCALE_ID) private _defaultLocale: string,
              @Inject(MAT_KEYBOARD_LAYOUTS) private _layouts: IKeyboardLayouts,
              @Optional() @SkipSelf() private _parentKeyboard: MatKeyboardService) {
    // prepare available layouts mapping
    this._availableLocales = _applyAvailableLayouts(_layouts);
  }

  /**
   * Creates and dispatches a keyboard with a custom component for the content, removing any
   * currently opened keyboards.
   *
   * @param layoutOrLocale layout or locale to use.
   * @param config Extra configuration for the keyboard.
   */
  openFromComponent(layoutOrLocale: string, config: MatKeyboardConfig): MatKeyboardRef<MatKeyboardComponent> {
    const keyboardRef: MatKeyboardRef<MatKeyboardComponent> = this._attachKeyboardContent(config);

    keyboardRef.instance.darkTheme = config.darkTheme;
    keyboardRef.instance.isDebug = config.isDebug;

    // a locale is provided
    if (this.availableLocales[layoutOrLocale]) {
      keyboardRef.instance.locale = layoutOrLocale;
      keyboardRef.instance.layout = this.getLayoutForLocale(layoutOrLocale);
    }

    // a layout name is provided
    if (this._layouts[layoutOrLocale]) {
      keyboardRef.instance.layout = this._layouts[layoutOrLocale];
      keyboardRef.instance.locale = this._layouts[layoutOrLocale].lang && this._layouts[layoutOrLocale].lang.pop();
    }

    // When the keyboard is dismissed, lower the keyboard counter.
    keyboardRef
      .afterDismissed()
      .subscribe(() => {
        // Clear the keyboard ref if it hasn't already been replaced by a newer keyboard.
        if (this._openedKeyboardRef === keyboardRef) {
          this._openedKeyboardRef = null;
        }
      });

    if (this._openedKeyboardRef) {
      // If a keyboard is already in view, dismiss it and enter the
      // new keyboard after exit animation is complete.
      this._openedKeyboardRef
        .afterDismissed()
        .subscribe(() => {
          keyboardRef.containerInstance.enter();
        });
      this._openedKeyboardRef.dismiss();
    } else {
      // If no keyboard is in view, enter the new keyboard.
      keyboardRef.containerInstance.enter();
    }

    // If a dismiss timeout is provided, set up dismiss based on after the keyboard is opened.
    // if (configs.duration > 0) {
    //   keyboardRef.afterOpened().subscribe(() => {
    //     setTimeout(() => keyboardRef.dismiss(), configs.duration);
    //   });
    // }

    if (config.announcementMessage) {
      this._live.announce(config.announcementMessage, config.politeness);
    }

    this._openedKeyboardRef = keyboardRef;
    return this._openedKeyboardRef;
  }

  /**
   * Opens a keyboard with a message and an optional action.
   * @param layoutOrLocale A string representing the locale or the layout name to be used.
   * @param config Additional configuration options for the keyboard.
   */
  open(layoutOrLocale: string = this._defaultLocale, config: MatKeyboardConfig = {}): MatKeyboardRef<MatKeyboardComponent> {
    const _config = _applyConfigDefaults(config);

    return this.openFromComponent(layoutOrLocale, _config);
  }

  /**
   * Dismisses the currently-visible keyboard.
   */
  dismiss() {
    if (this._openedKeyboardRef) {
      this._openedKeyboardRef.dismiss();
    }
  }

  /**
   * Map a given locale to a layout name.
   * @param locale The layout name
   */
  mapLocale(locale: string = this._defaultLocale): string {
    let layout: string;
    const country = locale
      .split('-')
      .shift();

    // search for layout matching the
    // first part, the country code
    if (this.availableLocales[country]) {
      layout = this.availableLocales[locale];
    }

    // look if the detailed locale matches any layout
    if (this.availableLocales[locale]) {
      layout = this.availableLocales[locale];
    }

    if (!layout) {
      throw Error(`No layout found for locale ${locale}`);
    }

    return layout;
  }

  getLayoutForLocale(locale: string): IKeyboardLayout {
    return this._layouts[this.mapLocale(locale)];
  }

  /**
   * Attaches the keyboard container component to the overlay.
   */
  private _attachKeyboardContainer(overlayRef: OverlayRef, config: MatKeyboardConfig): MatKeyboardContainerComponent {
    const containerPortal = new ComponentPortal(MatKeyboardContainerComponent, config.viewContainerRef);
    const containerRef: ComponentRef<MatKeyboardContainerComponent> = overlayRef.attach(containerPortal);

    // set config
    containerRef.instance.keyboardConfig = config;

    return containerRef.instance;
  }

  /**
   * Places a new component as the content of the keyboard container.
   */
  private _attachKeyboardContent(config: MatKeyboardConfig): MatKeyboardRef<MatKeyboardComponent> {
    const overlayRef = this._createOverlay();
    const container = this._attachKeyboardContainer(overlayRef, config);
    const portal = new ComponentPortal(MatKeyboardComponent);
    const contentRef = container.attachComponentPortal(portal);
    return new MatKeyboardRef(contentRef.instance, container, overlayRef) as MatKeyboardRef<MatKeyboardComponent>;
  }

  /**
   * Creates a new overlay and places it in the correct location.
   */
  private _createOverlay(): OverlayRef {
    const state = new OverlayConfig({
      width: '100%'
    });

    state.positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .bottom('0');

    return this._overlay.create(state);
  }
}
