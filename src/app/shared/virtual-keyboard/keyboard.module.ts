// External modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Angular CDK
import { LIVE_ANNOUNCER_PROVIDER } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
// Angular material
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
// Configs
import { keyboardDeadkeys, MAT_KEYBOARD_DEADKEYS } from './configs/keyboard-deadkey.config';
import { keyboardIcons, MAT_KEYBOARD_ICONS } from './configs/keyboard-icons.config';
import { keyboardLayouts, MAT_KEYBOARD_LAYOUTS } from './configs/keyboard-layouts.config';
// Components and directives
import { MatKeyboardContainerComponent } from './components/keyboard-container/keyboard-container.component';
import { MatKeyboardKeyComponent } from './components/keyboard-key/keyboard-key.component';
import { MatKeyboardComponent } from './components/keyboard/keyboard.component';
import { MatKeyboardDirective } from './directives/keyboard.directive';
// Providers
import { MatKeyboardKebabCasePipe } from './pipes/kebab-case.pipe';
import { MatKeyboardService } from './services/keyboard.service';

@NgModule({
  imports: [
    // Angular modules
    CommonModule,
    OverlayModule,

    // Cdk modules
    PortalModule,

    // Material modules
    MatButtonModule,
    MatCommonModule,
    MatIconModule,
    MatInputModule
  ],
  exports: [
    MatKeyboardComponent,
    MatKeyboardContainerComponent,
    MatKeyboardKeyComponent,
    MatKeyboardDirective
  ],
  declarations: [
    MatKeyboardKebabCasePipe,
    MatKeyboardComponent,
    MatKeyboardContainerComponent,
    MatKeyboardKeyComponent,
    MatKeyboardDirective
  ],
  entryComponents: [
    MatKeyboardComponent,
    MatKeyboardContainerComponent,
    MatKeyboardKeyComponent
  ],
  providers: [
    MatKeyboardService,
    LIVE_ANNOUNCER_PROVIDER,
    { provide: MAT_KEYBOARD_DEADKEYS, useValue: keyboardDeadkeys },
    { provide: MAT_KEYBOARD_ICONS, useValue: keyboardIcons },
    { provide: MAT_KEYBOARD_LAYOUTS, useValue: keyboardLayouts }
  ]
})
export class MatKeyboardModule {}
