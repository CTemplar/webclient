import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, UserState } from '../../store/datatypes';

export enum ThemeMode {
    DARK, LIGHT
}

@UntilDestroy()
@Injectable({
    providedIn: 'root'
})
export class ThemeToggleService implements OnDestroy {
    private readonly LIGHT_THEME_CLASS_NAME = 'theme-light';
    private readonly DARK_THEME_CLASS_NAME = 'theme-dark';

    private isDarkMode = false;
    public theme$ = new BehaviorSubject<ThemeMode>(ThemeMode.LIGHT);

    constructor(
        private store: Store<AppState>
    ) {
        /**
         * Get user settings
         */
        this.store
            .select(state => state.user)
            .pipe(untilDestroyed(this))
            .subscribe((user: UserState) => {
                const isDarkMode = user.settings.is_night_mode;
                if (this.isDarkMode !== isDarkMode) {
                    this.isDarkMode = isDarkMode;
                    this.updateTheme(this.isDarkMode);
                }
            });
    }

    private updateTheme(isDarkMode) {
        if (isDarkMode) {
            document.body.classList.add(this.DARK_THEME_CLASS_NAME);
            document.body.classList.remove(this.LIGHT_THEME_CLASS_NAME);
            this.theme$.next(ThemeMode.DARK);
        } else {
            document.body.classList.add(this.LIGHT_THEME_CLASS_NAME);
            document.body.classList.remove(this.DARK_THEME_CLASS_NAME);
            this.theme$.next(ThemeMode.LIGHT);
        }
    }

    public forceUpdateTheme(isDarkMode) {
        this.updateTheme(isDarkMode);
    }

    ngOnDestroy(): void {}
}

