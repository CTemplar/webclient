import { ModuleWithProviders, Type } from '@angular/core';
import { ngxZendeskWebwidgetConfig } from './ngx-zendesk-webwidget.model';
import { ngxZendeskWebwidgetService } from './ngx-zendesk-webwidget.service';
export declare class ngxZendeskWebwidgetModule {
    static forRoot(zendeskConfig: Type<ngxZendeskWebwidgetConfig>): ModuleWithProviders;
}
export { ngxZendeskWebwidgetService, ngxZendeskWebwidgetConfig };
