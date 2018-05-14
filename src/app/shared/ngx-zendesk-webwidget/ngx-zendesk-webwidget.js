import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @abstract
 */
var ngxZendeskWebwidgetConfig = /** @class */ (function () {
    function ngxZendeskWebwidgetConfig() {
    }
    return ngxZendeskWebwidgetConfig;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @return {?}
 */
function getWindow() {
    return window;
}
var ngxZendeskWebwidgetService = /** @class */ (function () {
    function ngxZendeskWebwidgetService(_ngxZendeskWebwidgetConfig) {
        var _this = this;
        if (!_ngxZendeskWebwidgetConfig.accountUrl) {
            throw new Error('Missing accountUrl. Please set in app config via ZendeskWidgetProvider');
        }
        this.window = getWindow();
        var /** @type {?} */ window = this.window;
        // Following is essentially a copy paste of JS portion of the Zendesk embed code
        // with our settings subbed in. For more info, see:
        // https://support.zendesk.com/hc/en-us/articles/203908456-Using-Web-Widget-to-embed-customer-service-in-your-website
        window.zEmbed || function (e, t) {
            var /** @type {?} */ n, /** @type {?} */ o, /** @type {?} */ d, /** @type {?} */ i, /** @type {?} */ s, /** @type {?} */ a = [], /** @type {?} */
            r = document.createElement("iframe");
            window.zEmbed = function () {
                a.push(arguments);
            }, window.zE = window.zE || window.zEmbed, r.src = "javascript:false", r.title = "", r.style.cssText = "display: none", d = document.getElementsByTagName("script"), d = d[d.length - 1], d.parentNode.insertBefore(r, d), i = r.contentWindow, s = i.document;
            try {
                o = s;
            }
            catch (/** @type {?} */ e) {
                n = document.domain, r.src = 'javascript:var d=document.open();d.domain="' + n + '";void(0);', o = s;
            }
            o.open()._l = function () {
                var /** @type {?} */ e = this.createElement("script");
                n && (this.domain = n), e.id = "js-iframe-async", e.src = "https://assets.zendesk.com/embeddable_framework/main.js", this.t = +new Date, this.zendeskHost = _ngxZendeskWebwidgetConfig.accountUrl, this.zEQueue = a, this.body.appendChild(e);
            }, o.write('<body onload="document._l();">'), o.close();
        }();
        this.window.zE(function () {
            _ngxZendeskWebwidgetConfig.beforePageLoad(_this.window.zE);
        });
    }
    /**
     * @param {?} locale
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.setLocale = /**
     * @param {?} locale
     * @return {?}
     */
    function (locale) {
        var _this = this;
        this.window.zE(function () {
            _this.window.zE.setLocale(locale);
        });
    };
    /**
     * @param {?} userObj
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.identify = /**
     * @param {?} userObj
     * @return {?}
     */
    function (userObj) {
        var _this = this;
        this.window.zE(function () {
            _this.window.zE.identify(userObj);
        });
    };
    /**
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.hide = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.window.zE(function () {
            _this.window.zE.hide();
        });
    };
    /**
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.show = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.window.zE(function () {
            _this.window.zE.show();
        });
    };
    /**
     * @param {?=} options
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.activate = /**
     * @param {?=} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        this.window.zE(function () {
            _this.window.zE.activate(options);
        });
    };
    /**
     * @param {?} options
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.setHelpCenterSuggestions = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        this.window.zE(function () {
            _this.window.zE.setHelpCenterSuggestions(options);
        });
    };
    /**
     * @param {?} settings
     * @return {?}
     */
    ngxZendeskWebwidgetService.prototype.setSettings = /**
     * @param {?} settings
     * @return {?}
     */
    function (settings) {
        this.window.zESettings = settings;
    };
    ngxZendeskWebwidgetService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ngxZendeskWebwidgetService.ctorParameters = function () { return [
        { type: ngxZendeskWebwidgetConfig, },
    ]; };
    return ngxZendeskWebwidgetService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ngxZendeskWebwidgetModule = /** @class */ (function () {
    function ngxZendeskWebwidgetModule() {
    }
    /**
     * @param {?} zendeskConfig
     * @return {?}
     */
    ngxZendeskWebwidgetModule.forRoot = /**
     * @param {?} zendeskConfig
     * @return {?}
     */
    function (zendeskConfig) {
        return {
            ngModule: ngxZendeskWebwidgetModule,
            providers: [
                { provide: ngxZendeskWebwidgetConfig, useClass: zendeskConfig },
                { provide: ngxZendeskWebwidgetService, useClass: ngxZendeskWebwidgetService, deps: [ngxZendeskWebwidgetConfig] }
            ]
        };
    };
    ngxZendeskWebwidgetModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ]
                },] },
    ];
    /** @nocollapse */
    ngxZendeskWebwidgetModule.ctorParameters = function () { return []; };
    return ngxZendeskWebwidgetModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { ngxZendeskWebwidgetModule, ngxZendeskWebwidgetService, ngxZendeskWebwidgetConfig };
