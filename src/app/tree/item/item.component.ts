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

    @Input() text: string;
    @Input() id: number;

    @Input() x: number;
    @Input() y: number;
    @Input() r = 40;

    @Input() width = 250;
    @Input() heigthWhenOpen;

    @Input() actif = false;

    @Output() selected = new EventEmitter<number>();

    activeColor = '#3974b3';
    inactiveColor = '#bababa';
    hoverColor = '#3974b3';

    textMargin = 20;

    initAtInfinit = true;

    private d3_rectangle: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_circle: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_container: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private d3_text: d3.Selection<BaseType, {}, HTMLElement, any>;

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

        if (changes.text) {
            this.d3_text.html(this.text);
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
            .attr('stroke', this.activeColor)
            .attr('stroke-width', 2)
            .attr('fill', 'white');

        this.d3_container = d3.select(element).append('foreignObject')
            .attr('x', this.x - (this.width - this.textMargin) / 2)
            .attr('y', this.y + this.r + this.textMargin / 2)
            .attr('width', this.width - this.textMargin);

        this.d3_text = this.d3_container.append('xhtml:div')
            .html(this.text)
            .attr('fill', 'black');

        this.d3_circle = d3.select(element).append('circle')
            .attr('cx', this.x + (this.initAtInfinit ? 3000 : 0))
            .attr('cy', this.y)
            .attr('r', this.r)
            .attr('stroke', this.inactiveColor)
            .attr('stroke-width', 2)
            .attr('fill', 'white')
            .on('mouseover', () => {
                this.d3_circle
                    .attr('stroke-width', 4)
                    .attr('stroke', this.hoverColor);
            })
            .on('mouseout', () => {
                this.d3_circle
                    .attr('stroke-width', 2)
                    .attr('stroke', this.actif ? this.activeColor : this.inactiveColor);
            })
            .on('click', () => this.selected.emit(this.id));

        const transitions = new Transitions();
        this.statusChange(transitions);

        if (this.initAtInfinit) {
            this.changePosition(transitions);
        }

        this.drawed = true;
    }

    statusChange(transitions = new Transitions()): void {
        if (this.actif) {
            if (!transitions.circle) {
                transitions.circle = this.d3_circle
                    .transition()
                    .duration(300);
            }

            transitions.circle
                .attr('stroke', this.activeColor);

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
            if (!transitions.circle) {
                transitions.circle = this.d3_circle
                    .transition()
                    .delay(500)
                    .duration(300);
            }

            transitions.circle
                .attr('stroke', this.inactiveColor);

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
    }
}

class Transitions {
    rectangle: d3.Transition<SVGElement, {}, HTMLElement, any>;
    circle: d3.Transition<SVGElement, {}, HTMLElement, any>;
    container: d3.Transition<SVGElement, {}, HTMLElement, any>;
    text: d3.Transition<SVGElement, {}, HTMLElement, any>;
}
