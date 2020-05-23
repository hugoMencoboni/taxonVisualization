import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { BaseType } from 'd3';

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
    @Input() r = 40;

    @Input() width = 275;
    @Input() heigthWhenOpen;

    @Input() actif = false;
    @Input() addButton = true;

    @Output() selected = new EventEmitter<number>();
    @Output() add = new EventEmitter<number>();

    @Input() color = '#3974b3';
    backgroundColor = 'white';

    textMargin = 20;
    addButtonRadius = 5;

    initAtInfinit = true;

    private d3_rectangle: d3.Selection<SVGElement, {}, HTMLElement, any>;
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

        const transition = new Transitions();
        if (changes.x || changes.y || changes.r || changes.width) {
            this.changePosition(transition);
        }

        if (changes.actif) {
            this.statusChange(transition);
        }

        if (changes.addButton) {
            this.d3_addButton.attr('r', this.addButton ? this.addButtonRadius : 0);
        }

        if (changes.text) {
            this.d3_text.html(this.text);
        }

        if (changes.mediaUrl) {
            this.mediaChange(transition);
        }
    }

    private draw(): void {
        if (!this.itemContainer) { return; }

        const element = this.itemContainer.nativeElement;

        this.d3_rectangle = d3.select(element).append('rect')
            .attr('x', this.x - this.width / 2)
            .attr('y', this.y)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('width', this.width)
            .attr('stroke', this.color)
            .attr('stroke-width', 2)
            .attr('fill', this.backgroundColor);

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
            .attr('stroke-width', 2)
            .attr('fill', this.backgroundColor)
            .attr('fill-opacity', this.mediaUrl && this.mediaUrl.length ? 0 : 1)
            .on('mouseover', () => {
                this.d3_circle
                    .attr('stroke-width', 4);
            })
            .on('mouseout', () => {
                this.d3_circle
                    .attr('stroke-width', 2);
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

        const transitions = new Transitions();
        this.statusChange(transitions);

        if (this.initAtInfinit) {
            this.changePosition(transitions);
        }

        this.drawed = true;
    }

    statusChange(transitions = new Transitions()): void {
        if (this.actif) {
            if (!transitions.rectangle) {
                transitions.rectangle = this.d3_rectangle
                    .transition()
                    .delay(300)
                    .duration(500);
            }

            transitions.rectangle
                .attr('height', this.heigthWhenOpen);

            if (!transitions.container) {
                transitions.container = this.d3_container
                    .transition()
                    .delay(300)
                    .duration(500);
            }

            transitions.container
                .attr('height', this.heigthWhenOpen - this.r - this.textMargin);
        } else {
            if (!transitions.rectangle) {
                transitions.rectangle = this.d3_rectangle
                    .transition()
                    .duration(500)
                    .attr('height', 0);
            }

            transitions.rectangle
                .attr('height', 0);

            if (!transitions.container) {
                transitions.container = this.d3_container
                    .transition();
            }

            transitions.container
                .attr('height', 0);
        }
    }

    changePosition(transitions = new Transitions()): void {
        if (!transitions.rectangle) {
            transitions.rectangle = this.d3_rectangle
                .transition()
                .duration(750);
        }

        transitions.rectangle
            .attr('x', this.x - this.width / 2)
            .attr('y', this.y)
            .attr('width', this.width);

        if (!transitions.container) {
            transitions.container = this.d3_container
                .transition()
                .duration(750);
        }

        transitions.container
            .attr('x', this.x - (this.width - this.textMargin) / 2)
            .attr('y', this.y + this.r + this.textMargin / 2)
            .attr('width', this.width - this.textMargin);

        if (!transitions.circle) {
            transitions.circle = this.d3_circle
                .transition()
                .duration(750);
        }

        transitions.circle
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r);

        if (!transitions.clipPath) {
            transitions.clipPath = this.d3_clipPath
                .transition()
                .duration(750);
        }

        transitions.clipPath
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r);

        if (!transitions.image) {
            transitions.image = this.d3_image
                .transition()
                .duration(750);
        }

        transitions.image
            .attr('x', this.x - this.r)
            .attr('y', this.y - this.r);

        if (!transitions.addButton) {
            transitions.addButton = this.d3_addButton
                .transition()
                .duration(750);
        }

        transitions.addButton
            .attr('cx', this.x + this.r)
            .attr('cy', this.y - this.r);
    }

    mediaChange(transitions = new Transitions()): void {
        if (!this.mediaUrl.length) {
            return;
        }

        if (!transitions.image) {
            transitions.image = this.d3_image
                .transition()
                .duration(750);
        }

        transitions.image
            .attr('xlink:href', this.mediaUrl[0]);


        if (!transitions.circle) {
            transitions.image = this.d3_circle
                .transition()
                .duration(750);
        }

        transitions.circle
            .attr('fill-opacity', this.mediaUrl.length ? 0 : 1);
    }
}

class Transitions {
    rectangle: d3.Transition<SVGElement, {}, HTMLElement, any>;
    circle: d3.Transition<SVGElement, {}, HTMLElement, any>;
    container: d3.Transition<SVGElement, {}, HTMLElement, any>;
    text: d3.Transition<SVGElement, {}, HTMLElement, any>;
    addButton: d3.Transition<SVGElement, {}, HTMLElement, any>;
    clipPath: d3.Transition<SVGElement, {}, HTMLElement, any>;
    image: d3.Transition<BaseType, {}, HTMLElement, any>;
}
