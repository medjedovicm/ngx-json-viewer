import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgxJsonViewerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uZ3gtanNvbi12aWV3ZXIvbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3NyYy9uZ3gtanNvbi12aWV3ZXIvbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQWVsRixNQUFNLE9BQU8sc0JBQXNCO0lBTG5DO1FBUVcsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixVQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFWCxrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUVqQix1QkFBa0IsR0FBeUIsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUVoRixhQUFRLEdBQWMsRUFBRSxDQUFDO0tBbUoxQjtJQWpKQyxXQUFXO1FBQ1QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFFbkIsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFcEMsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEs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QUF0QixzQkFBc0IsbU9DZm5DLG1pQ0F3QkEsaWhHRFRhLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQUxsQyxTQUFTOytCQUNFLGlCQUFpQjs4QkFNbEIsSUFBSTtzQkFBWixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUVHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBRUksa0JBQWtCO3NCQUEzQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkNoYW5nZXMsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlZ21lbnQge1xuICBrZXk6IHN0cmluZztcbiAgdmFsdWU6IGFueTtcbiAgdHlwZTogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBleHBhbmRlZDogYm9vbGVhbjtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWpzb24tdmlld2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1qc29uLXZpZXdlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1qc29uLXZpZXdlci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEpzb25WaWV3ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpIGpzb246IGFueTtcbiAgQElucHV0KCkgZXhwYW5kZWQgPSB0cnVlO1xuICBASW5wdXQoKSBkZXB0aCA9IC0xO1xuXG4gIEBJbnB1dCgpIF9jdXJyZW50RGVwdGggPSAwO1xuXG4gIEBPdXRwdXQoKSBzZWdtZW50TGlua0NsaWNrZWQ6IEV2ZW50RW1pdHRlcjxzdHJpbmc+ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgc2VnbWVudHM6IFNlZ21lbnRbXSA9IFtdO1xuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcblxuICAgIC8vIHJlbW92ZSBjeWNsZXNcbiAgICB0aGlzLmpzb24gPSB0aGlzLmRlY3ljbGUodGhpcy5qc29uKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5qc29uID09PSAnb2JqZWN0Jykge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5qc29uKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaCh0aGlzLnBhcnNlS2V5VmFsdWUoa2V5LCB0aGlzLmpzb25ba2V5XSkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VnbWVudHMucHVzaCh0aGlzLnBhcnNlS2V5VmFsdWUoYCgke3R5cGVvZiB0aGlzLmpzb259KWAsIHRoaXMuanNvbikpO1xuICAgIH1cbiAgfVxuXG4gIGlzRXhwYW5kYWJsZShzZWdtZW50OiBTZWdtZW50KSB7XG4gICAgcmV0dXJuIHNlZ21lbnQudHlwZSA9PT0gJ29iamVjdCcgfHwgc2VnbWVudC50eXBlID09PSAnYXJyYXknO1xuICB9XG5cbiAgdG9nZ2xlKHNlZ21lbnQ6IFNlZ21lbnQpIHtcbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoc2VnbWVudCkpIHtcbiAgICAgIHNlZ21lbnQuZXhwYW5kZWQgPSAhc2VnbWVudC5leHBhbmRlZDtcbiAgICB9XG4gIH1cblxuICBvblZhbHVlQ2xpY2soc2VnbWVudDogU2VnbWVudCkge1xuICAgIGlmIChzZWdtZW50LnR5cGUgPT09ICdsaW5rJykgdGhpcy5zZWdtZW50TGlua0NsaWNrZWQuZW1pdChzZWdtZW50LnZhbHVlKVxuICB9XG5cbiAgb25TZWdtZW50TGlua0NsaWNrKGxpbms6IHN0cmluZykge1xuICAgIHRoaXMuc2VnbWVudExpbmtDbGlja2VkLmVtaXQobGluaylcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VLZXlWYWx1ZShrZXk6IGFueSwgdmFsdWU6IGFueSk6IFNlZ21lbnQge1xuICAgIGNvbnN0IHNlZ21lbnQ6IFNlZ21lbnQgPSB7XG4gICAgICBrZXk6IGtleSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHR5cGU6IHVuZGVmaW5lZCxcbiAgICAgIGRlc2NyaXB0aW9uOiAnJyArIHZhbHVlLFxuICAgICAgZXhwYW5kZWQ6IHRoaXMuaXNFeHBhbmRlZCgpXG4gICAgfTtcblxuICAgIHN3aXRjaCAodHlwZW9mIHNlZ21lbnQudmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ251bWJlcic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnYm9vbGVhbic6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ2Jvb2xlYW4nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzoge1xuICAgICAgICBzZWdtZW50LnR5cGUgPSAnZnVuY3Rpb24nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3N0cmluZyc6IHtcbiAgICAgICAgaWYgKHRoaXMuaXNMaW5rKHNlZ21lbnQudmFsdWUpKSB7XG4gICAgICAgICAgc2VnbWVudC50eXBlID0gJ2xpbmsnO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VnbWVudC50eXBlID0gJ3N0cmluZyc7XG4gICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAnXCInICsgc2VnbWVudC52YWx1ZSArICdcIic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAndW5kZWZpbmVkJzoge1xuICAgICAgICBzZWdtZW50LnR5cGUgPSAndW5kZWZpbmVkJztcbiAgICAgICAgc2VnbWVudC5kZXNjcmlwdGlvbiA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ29iamVjdCc6IHtcbiAgICAgICAgLy8geWVhLCBudWxsIGlzIG9iamVjdFxuICAgICAgICBpZiAoc2VnbWVudC52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHNlZ21lbnQudHlwZSA9ICdudWxsJztcbiAgICAgICAgICBzZWdtZW50LmRlc2NyaXB0aW9uID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2VnbWVudC52YWx1ZSkpIHtcbiAgICAgICAgICBzZWdtZW50LnR5cGUgPSAnYXJyYXknO1xuICAgICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAnQXJyYXlbJyArIHNlZ21lbnQudmFsdWUubGVuZ3RoICsgJ10gJyArIEpTT04uc3RyaW5naWZ5KHNlZ21lbnQudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlZ21lbnQudmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgc2VnbWVudC50eXBlID0gJ2RhdGUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlZ21lbnQudHlwZSA9ICdvYmplY3QnO1xuICAgICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAnT2JqZWN0ICcgKyBKU09OLnN0cmluZ2lmeShzZWdtZW50LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgaXNMaW5rKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdmFsdWUuc3Vic3RyaW5nKDAsIDgpID09PSAnaHR0cHM6Ly8nIHx8XG4gICAgICB2YWx1ZS5zdWJzdHJpbmcoMCwgNykgPT09ICdodHRwOi8vJyB8fFxuICAgICAgdmFsdWVbMF0gPT09ICcvJ1xuICB9XG5cbiAgcHJpdmF0ZSBpc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmV4cGFuZGVkICYmXG4gICAgICAhKHRoaXMuZGVwdGggPiAtMSAmJiB0aGlzLl9jdXJyZW50RGVwdGggPj0gdGhpcy5kZXB0aClcbiAgICApO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvdWdsYXNjcm9ja2ZvcmQvSlNPTi1qcy9ibG9iL21hc3Rlci9jeWNsZS5qc1xuICBwcml2YXRlIGRlY3ljbGUob2JqZWN0OiBhbnkpIHtcbiAgICBjb25zdCBvYmplY3RzID0gbmV3IFdlYWtNYXAoKTtcbiAgICByZXR1cm4gKGZ1bmN0aW9uIGRlcmV6KHZhbHVlLCBwYXRoKSB7XG4gICAgICBsZXQgb2xkX3BhdGg7XG4gICAgICBsZXQgbnU6IGFueTtcblxuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG4gICAgICAgICYmIHZhbHVlICE9PSBudWxsXG4gICAgICAgICYmICEodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuKVxuICAgICAgICAmJiAhKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSlcbiAgICAgICAgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIE51bWJlcilcbiAgICAgICAgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAgICAgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZylcbiAgICAgICkge1xuICAgICAgICBvbGRfcGF0aCA9IG9iamVjdHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKG9sZF9wYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4geyRyZWY6IG9sZF9wYXRofTtcbiAgICAgICAgfVxuICAgICAgICBvYmplY3RzLnNldCh2YWx1ZSwgcGF0aCk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgbnUgPSBbXTtcbiAgICAgICAgICB2YWx1ZS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpKSB7XG4gICAgICAgICAgICBudVtpXSA9IGRlcmV6KGVsZW1lbnQsIHBhdGggKyAnWycgKyBpICsgJ10nKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudSA9IHt9O1xuICAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBudVtuYW1lXSA9IGRlcmV6KFxuICAgICAgICAgICAgICB2YWx1ZVtuYW1lXSxcbiAgICAgICAgICAgICAgcGF0aCArICdbJyArIEpTT04uc3RyaW5naWZ5KG5hbWUpICsgJ10nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KG9iamVjdCwgJyQnKSk7XG4gIH1cbn1cbiIsIjxzZWN0aW9uIGNsYXNzPVwibmd4LWpzb24tdmlld2VyXCI+XG4gIDxzZWN0aW9uXG4gICAgKm5nRm9yPVwibGV0IHNlZ21lbnQgb2Ygc2VnbWVudHNcIlxuICAgIFtuZ0NsYXNzXT1cIlsnc2VnbWVudCcsICdzZWdtZW50LXR5cGUtJyArIHNlZ21lbnQudHlwZV1cIj5cbiAgICA8c2VjdGlvblxuICAgICAgKGNsaWNrKT1cInRvZ2dsZShzZWdtZW50KVwiXG4gICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICdzZWdtZW50LW1haW4nOiB0cnVlLFxuICAgICAgICAnZXhwYW5kYWJsZSc6IGlzRXhwYW5kYWJsZShzZWdtZW50KSxcbiAgICAgICAgJ2V4cGFuZGVkJzogc2VnbWVudC5leHBhbmRlZFxuICAgICAgfVwiPlxuICAgICAgPGRpdiAqbmdJZj1cImlzRXhwYW5kYWJsZShzZWdtZW50KVwiIGNsYXNzPVwidG9nZ2xlclwiPjwvZGl2PlxuICAgICAgPHNwYW4gY2xhc3M9XCJzZWdtZW50LWtleVwiPnt7IHNlZ21lbnQua2V5IH19PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJzZWdtZW50LXNlcGFyYXRvclwiPjogPC9zcGFuPlxuICAgICAgPHNwYW5cbiAgICAgICAgKGNsaWNrKT1cIm9uVmFsdWVDbGljayhzZWdtZW50KVwiXG4gICAgICAgICpuZ0lmPVwiIXNlZ21lbnQuZXhwYW5kZWQgfHwgIWlzRXhwYW5kYWJsZShzZWdtZW50KVwiXG4gICAgICAgIGNsYXNzPVwic2VnbWVudC12YWx1ZVwiPnt7IHNlZ21lbnQuZGVzY3JpcHRpb24gfX08L3NwYW4+XG4gICAgPC9zZWN0aW9uPlxuICAgIDxzZWN0aW9uICpuZ0lmPVwic2VnbWVudC5leHBhbmRlZCAmJiBpc0V4cGFuZGFibGUoc2VnbWVudClcIiBjbGFzcz1cImNoaWxkcmVuXCI+XG4gICAgICA8bmd4LWpzb24tdmlld2VyIFtqc29uXT1cInNlZ21lbnQudmFsdWVcIiBbZXhwYW5kZWRdPVwiZXhwYW5kZWRcIiBbZGVwdGhdPVwiZGVwdGhcIiBbX2N1cnJlbnREZXB0aF09XCJfY3VycmVudERlcHRoKzFcIiAoc2VnbWVudExpbmtDbGlja2VkKT1cIm9uU2VnbWVudExpbmtDbGljaygkZXZlbnQpXCI+PC9uZ3gtanNvbi12aWV3ZXI+XG4gICAgPC9zZWN0aW9uPlxuICA8L3NlY3Rpb24+XG48L3NlY3Rpb24+XG4iXX0=