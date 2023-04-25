import { OnChanges, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export interface Segment {
    key: string;
    value: any;
    type: undefined | string;
    description: string;
    expanded: boolean;
}
export declare class NgxJsonViewerComponent implements OnChanges {
    json: any;
    expanded: boolean;
    depth: number;
    _currentDepth: number;
    segmentLinkClicked: EventEmitter<string>;
    segments: Segment[];
    ngOnChanges(): void;
    isExpandable(segment: Segment): boolean;
    toggle(segment: Segment): void;
    onValueClick(segment: Segment): void;
    onSegmentLinkClick(link: string): void;
    private parseKeyValue;
    private isLink;
    private isExpanded;
    private decycle;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxJsonViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxJsonViewerComponent, "ngx-json-viewer", never, { "json": "json"; "expanded": "expanded"; "depth": "depth"; "_currentDepth": "_currentDepth"; }, { "segmentLinkClicked": "segmentLinkClicked"; }, never, never, false>;
}
