import { ngxZendeskWebwidgetConfig } from './ngx-zendesk-webwidget.model';
export declare class ngxZendeskWebwidgetService {
    private window;
    constructor(_ngxZendeskWebwidgetConfig?: ngxZendeskWebwidgetConfig);
    setLocale(locale: any): void;
    identify(userObj: any): void;
    hide(): void;
    show(): void;
    activate(options?: any): void;
    setHelpCenterSuggestions(options: any): void;
    setSettings(settings: any): void;
}
