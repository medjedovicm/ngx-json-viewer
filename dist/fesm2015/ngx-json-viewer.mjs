import * as i0 from '@angular/core';
import { EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

class NgxJsonViewerComponent {
    constructor() {
        this.expanded = true;
        this.depth = -1;
        this._currentDepth = 0;
        this.segmentLinkClicked = new EventEmitter();
        this.segments = [];
    }
    ngOnChanges() {
        this.segments = [];
        // remove cycles
        this.json = this.decycle(this.json);
        if (typeof this.json === 'object') {
            Object.keys(this.json).forEach(key => {
                this.segments.push(this.parseKeyValue(key, this.json[key]));
            });
        }
        else {
            this.segments.push(this.parseKeyValue(`(${typeof this.json})`, this.json));
        }
    }
    isExpandable(segment) {
        return segment.type === 'object' || segment.type === 'array';
    }
    toggle(segment) {
        if (this.isExpandable(segment)) {
            segment.expanded = !segment.expanded;
        }
    }
    onValueClick(segment) {
        if (segment.type === 'link')
            this.segmentLinkClicked.emit(segment.value);
    }
    onSegmentLinkClick(link) {
        this.segmentLinkClicked.emit(link);
    }
    parseKeyValue(key, value) {
        const segment = {
            key: key,
            value: value,
            type: undefined,
            description: '' + value,
            expanded: this.isExpanded()
        };
        switch (typeof segment.value) {
            case 'number': {
                segment.type = 'number';
                break;
            }
            case 'boolean': {
                segment.type = 'boolean';
                break;
            }
            case 'function': {
                segment.type = 'function';
                break;
            }
            case 'string': {
                if (this.isLink(segment.value)) {
                    segment.type = 'link';
                    break;
                }
                segment.type = 'string';
                segment.description = '"' + segment.value + '"';
                break;
            }
            case 'undefined': {
                segment.type = 'undefined';
                segment.description = 'undefined';
                break;
            }
            case 'object': {
                // yea, null is object
                if (segment.value === null) {
                    segment.type = 'null';
                    segment.description = 'null';
                }
                else if (Array.isArray(segment.value)) {
                    segment.type = 'array';
                    segment.description = 'Array[' + segment.value.length + '] ' + JSON.stringify(segment.value);
                }
                else if (segment.value instanceof Date) {
                    segment.type = 'date';
                }
                else {
                    segment.type = 'object';
                    segment.description = 'Object ' + JSON.stringify(segment.value);
                }
                break;
            }
        }
        return segment;
    }
    isLink(value) {
        return value.substring(0, 8) === 'https://' ||
            value.substring(0, 7) === 'http://' ||
            value[0] === '/';
    }
    isExpanded() {
        return (this.expanded &&
            !(this.depth > -1 && this._currentDepth >= this.depth));
    }
    // https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
    decycle(object) {
        const objects = new WeakMap();
        return (function derez(value, path) {
            let old_path;
            let nu;
            if (typeof value === 'object'
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)) {
                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return { $ref: old_path };
                }
                objects.set(value, path);
                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + '[' + i + ']');
                    });
                }
                else {
                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        nu[name] = derez(value[name], path + '[' + JSON.stringify(name) + ']');
                    });
                }
                return nu;
            }
            return value;
        }(object, '$'));
    }
}
NgxJsonViewerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.3", ngImport: i0, type: NgxJsonViewerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxJsonViewerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.3", type: NgxJsonViewerComponent, selector: "ngx-json-viewer", inputs: { json: "json", expanded: "expanded", depth: "depth", _currentDepth: "_currentDepth" }, outputs: { segmentLinkClicked: "segmentLinkClicked" }, usesOnChanges: true, ngImport: i0, template: "<section class=\"ngx-json-viewer\">\n  <section\n    *ngFor=\"let segment of segments\"\n    [ngClass]=\"['segment', 'segment-type-' + segment.type]\">\n    <section\n      (click)=\"toggle(segment)\"\n      [ngClass]=\"{\n        'segment-main': true,\n        'expandable': isExpandable(segment),\n        'expanded': segment.expanded\n      }\">\n      <div *ngIf=\"isExpandable(segment)\" class=\"toggler\"></div>\n      <span class=\"segment-key\">{{ segment.key }}</span>\n      <span class=\"segment-separator\">: </span>\n      <span\n        (click)=\"onValueClick(segment)\"\n        *ngIf=\"!segment.expanded || !isExpandable(segment)\"\n        class=\"segment-value\">{{ segment.description }}</span>\n    </section>\n    <section *ngIf=\"segment.expanded && isExpandable(segment)\" class=\"children\">\n      <ngx-json-viewer [json]=\"segment.value\" [expanded]=\"expanded\" [depth]=\"depth\" [_currentDepth]=\"_currentDepth+1\" (segmentLinkClicked)=\"onSegmentLinkClick($event)\"></ngx-json-viewer>\n    </section>\n  </section>\n</section>\n", styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:var(--ngx-json-font-family, monospace);font-size:var(--ngx-json-font-size, 1em);width:100%;height:100%;overflow:hidden;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:var(--ngx-json-toggler, #787878)}.ngx-json-viewer .segment .segment-main .toggler:after{display:inline-block;content:\"\\25ba\";transition:transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:var(--ngx-json-key, #4E187C)}.ngx-json-viewer .segment .segment-main .segment-separator{color:var(--ngx-json-separator, #999)}.ngx-json-viewer .segment .segment-main .segment-value{color:var(--ngx-json-value, #000)}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:var(--ngx-json-string, #FF6B6B)}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:var(--ngx-json-number, #009688)}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:var(--ngx-json-boolean, #B938A4)}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:var(--ngx-json-date, #05668D)}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value{color:var(--ngx-json-array, #999)}.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:var(--ngx-json-object, #999)}.ngx-json-viewer .segment-type-function>.segment-main>.segment-value{color:var(--ngx-json-function, #999)}.ngx-json-viewer .segment-type-link>.segment-main>.segment-value{color:var(--ngx-json-link, #9B59B6)}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{color:var(--ngx-json-null, #fff)}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:var(--ngx-json-undefined, #fff)}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:var(--ngx-json-null-bg, red)}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:var(--ngx-json-undefined-key, #999)}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:var(--ngx-json-undefined-key, #999)}.ngx-json-viewer .segment-type-link>.segment-main>.segment-value{text-decoration:underline;cursor:pointer}.ngx-json-viewer .segment-type-object>.segment-main,.ngx-json-viewer .segment-type-array>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler:after{transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: NgxJsonViewerComponent, selector: "ngx-json-viewer", inputs: ["json", "expanded", "depth", "_currentDepth"], outputs: ["segmentLinkClicked"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.3", ngImport: i0, type: NgxJsonViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-json-viewer', template: "<section class=\"ngx-json-viewer\">\n  <section\n    *ngFor=\"let segment of segments\"\n    [ngClass]=\"['segment', 'segment-type-' + segment.type]\">\n    <section\n      (click)=\"toggle(segment)\"\n      [ngClass]=\"{\n        'segment-main': true,\n        'expandable': isExpandable(segment),\n        'expanded': segment.expanded\n      }\">\n      <div *ngIf=\"isExpandable(segment)\" class=\"toggler\"></div>\n      <span class=\"segment-key\">{{ segment.key }}</span>\n      <span class=\"segment-separator\">: </span>\n      <span\n        (click)=\"onValueClick(segment)\"\n        *ngIf=\"!segment.expanded || !isExpandable(segment)\"\n        class=\"segment-value\">{{ segment.description }}</span>\n    </section>\n    <section *ngIf=\"segment.expanded && isExpandable(segment)\" class=\"children\">\n      <ngx-json-viewer [json]=\"segment.value\" [expanded]=\"expanded\" [depth]=\"depth\" [_currentDepth]=\"_currentDepth+1\" (segmentLinkClicked)=\"onSegmentLinkClick($event)\"></ngx-json-viewer>\n    </section>\n  </section>\n</section>\n", styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:var(--ngx-json-font-family, monospace);font-size:var(--ngx-json-font-size, 1em);width:100%;height:100%;overflow:hidden;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:var(--ngx-json-toggler, #787878)}.ngx-json-viewer .segment .segment-main .toggler:after{display:inline-block;content:\"\\25ba\";transition:transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:var(--ngx-json-key, #4E187C)}.ngx-json-viewer .segment .segment-main .segment-separator{color:var(--ngx-json-separator, #999)}.ngx-json-viewer .segment .segment-main .segment-value{color:var(--ngx-json-value, #000)}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:var(--ngx-json-string, #FF6B6B)}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:var(--ngx-json-number, #009688)}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:var(--ngx-json-boolean, #B938A4)}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:var(--ngx-json-date, #05668D)}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value{color:var(--ngx-json-array, #999)}.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:var(--ngx-json-object, #999)}.ngx-json-viewer .segment-type-function>.segment-main>.segment-value{color:var(--ngx-json-function, #999)}.ngx-json-viewer .segment-type-link>.segment-main>.segment-value{color:var(--ngx-json-link, #9B59B6)}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{color:var(--ngx-json-null, #fff)}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:var(--ngx-json-undefined, #fff)}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:var(--ngx-json-null-bg, red)}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:var(--ngx-json-undefined-key, #999)}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:var(--ngx-json-undefined-key, #999)}.ngx-json-viewer .segment-type-link>.segment-main>.segment-value{text-decoration:underline;cursor:pointer}.ngx-json-viewer .segment-type-object>.segment-main,.ngx-json-viewer .segment-type-array>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler:after{transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}\n"] }]
        }], propDecorators: { json: [{
                type: Input
            }], expanded: [{
                type: Input
            }], depth: [{
                type: Input
            }], _currentDepth: [{
                type: Input
            }], segmentLinkClicked: [{
                type: Output
            }] } });

class NgxJsonViewerModule {
}
NgxJsonViewerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.3", ngImport: i0, type: NgxJsonViewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxJsonViewerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.3", ngImport: i0, type: NgxJsonViewerModule, declarations: [NgxJsonViewerComponent], imports: [CommonModule], exports: [NgxJsonViewerComponent] });
NgxJsonViewerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.3", ngImport: i0, type: NgxJsonViewerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.3", ngImport: i0, type: NgxJsonViewerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        NgxJsonViewerComponent
                    ],
                    exports: [
                        NgxJsonViewerComponent
                    ]
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { NgxJsonViewerComponent, NgxJsonViewerModule };
//# sourceMappingURL=ngx-json-viewer.mjs.map
