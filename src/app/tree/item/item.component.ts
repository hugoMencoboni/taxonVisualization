import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import { AttrTransition } from 'src/app/core/helpers/d3.helper';

@Component({
    selector: '[app-item]',
    template: '<svg:g #itemContainer></g>'
})
export class ItemComponent implements OnChanges, AfterViewInit {
    @ViewChild('itemContainer')
    public itemContainer: ElementRef;

    @Input() id: number;
    @Input() text: string;
    @Input() mediaUrl: Array<string>;

    @Input() x: number;
    @Input() y: number;
    @Input() r = 25;

    @Input() width = 175;
    @Input() heigthWhenOpen;

    @Input() actif = false;
    @Input() addButton = true;

    @Output() selected = new EventEmitter<number>();
    @Output() add = new EventEmitter<number>();

    @Input() color = '#3974b3';
    backgroundColor = 'white';

    textMargin = 10;
    addButtonRadius = 2;

    initAtInfinit = true;

    private d3_circle: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_container: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_text: d3.Selection<BaseType, {}, HTMLElement, any>;
    private d3_addButton: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_clipPath: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_image: d3.Selection<BaseType, {}, HTMLElement, any>;

    private drawed = false;

    constructor() { }

    ngAfterViewInit(): void {
        this.draw();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.drawed) { return; }

        if (changes.x || changes.y || changes.r || changes.width) {
            this.changePosition();
        }

        if (changes.actif) {
            this.statusChange();
        }

        if (changes.addButton) {
            this.d3_addButton.attr('r', this.addButton ? this.addButtonRadius : 0);
        }

        if (changes.text) {
            this.d3_text.html(this.text);
        }

        if (changes.mediaUrl) {
            this.mediaChange();
        }
    }

    private draw(): void {
        if (!this.itemContainer) { return; }

        const element = this.itemContainer.nativeElement;

        this.d3_container = d3.select(element).append('foreignObject')
            .attr('x', this.x - (this.width - this.textMargin) / 2)
            .attr('y', this.y + this.r + this.textMargin / 2)
            .attr('width', this.width - this.textMargin);

        this.d3_text = this.d3_container.append('xhtml:div')
            .html(this.text)
            .attr('fill', 'black');

        this.d3_clipPath = d3.select(element)
            .append('defs')
            .append('clipPath')
            .attr('id', `image-${this.id}`)
            .append('circle')
            .attr('cx', this.x + (this.initAtInfinit ? 3000 : 0))
            .attr('cy', this.y)
            .attr('r', this.r);

        this.d3_image = d3.select(element).append('svg:image')
            .attr('xlink:href', this.mediaUrl && this.mediaUrl.length ? this.mediaUrl[0] : '')
            // .attr('width', this.r)
            .attr('height', 2 * this.r)
            .attr('x', this.x + (this.initAtInfinit ? 3000 : 0))
            .attr('y', this.y)
            .attr('clip-path', `url(#image-${this.id})`);

        this.d3_circle = d3.select(element).append('circle')
            .attr('cx', this.x + (this.initAtInfinit ? 3000 : 0))
            .attr('cy', this.y)
            .attr('r', this.r)
            .attr('stroke', this.color)
            .attr('stroke-width', 1)
            .attr('fill', this.backgroundColor)
            .attr('fill-opacity', this.mediaUrl && this.mediaUrl.length ? 0 : 1)
            .on('mouseover', () => {
                this.d3_circle
                    .attr('stroke-width', 2);
            })
            .on('mouseout', () => {
                this.d3_circle
                    .attr('stroke-width', 1);
            })
            .on('click', () => this.selected.emit(this.id));

        this.d3_addButton = d3.select(element).append('circle')
            .attr('cx', this.x + this.r + (this.initAtInfinit ? 3000 : 0))
            .attr('cy', this.y - this.r)
            .attr('r', this.addButton ? this.addButtonRadius : 0)
            .attr('stroke', this.color)
            .attr('stroke-width', 1)
            .attr('fill', this.backgroundColor)
            .on('mouseover', () => {
                this.d3_addButton
                    .attr('fill', this.color);
            })
            .on('mouseout', () => {
                this.d3_addButton
                    .attr('fill', this.backgroundColor);
            })
            .on('click', () => this.add.emit(this.id));

        this.statusChange();

        if (this.initAtInfinit) {
            this.changePosition();
        }

        this.drawed = true;
    }

    statusChange(): void {
        if (this.actif) {
            this.d3_container.call(AttrTransition,
                [{ attr: 'height', newValue: this.heigthWhenOpen - this.r - this.textMargin }], 300, 500);
        } else {
            this.d3_container.call(AttrTransition, [{ attr: 'height', newValue: 0 }], 300);
        }
    }

    changePosition(): void {
        this.d3_container.call(AttrTransition, [
            { attr: 'x', newValue: this.x - (this.width - this.textMargin) / 2 },
            { attr: 'y', newValue: this.y + this.r + this.textMargin / 2 },
            { attr: 'width', newValue: this.width - this.textMargin }
        ], 750);

        this.d3_circle.call(AttrTransition, [
            { attr: 'cx', newValue: this.x },
            { attr: 'cy', newValue: this.y },
            { attr: 'r', newValue: this.r }
        ], 750);

        this.d3_clipPath.call(AttrTransition, [
            { attr: 'cx', newValue: this.x },
            { attr: 'cy', newValue: this.y },
            { attr: 'r', newValue: this.r }
        ], 750);

        this.d3_image.call(AttrTransition, [
            { attr: 'x', newValue: this.x - this.r },
            { attr: 'y', newValue: this.y - this.r }
        ], 750);

        this.d3_addButton.call(AttrTransition, [
            { attr: 'cx', newValue: this.x + this.r },
            { attr: 'cy', newValue: this.y - this.r }
        ], 750);
    }

    mediaChange(): void {
        if (!this.mediaUrl.length) {
            return;
        }

        this.d3_image.call(AttrTransition, [{ attr: 'xlink:href', newValue: this.mediaUrl[0] }], 750);
        this.d3_circle.call(AttrTransition, [{ attr: 'fill-opacity', newValue: this.mediaUrl.length ? 0 : 1 }], 0);
    }
}
