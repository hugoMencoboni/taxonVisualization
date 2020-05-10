import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: '[app-item]',
    template: '<svg:g #itemContainer></g>',
    styleUrls: ['./item.component.scss']
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

    textMargin = 20;

    private d3_rectangle;
    private d3_circle;
    private d3_container;
    private d3_text;

    private drawed = false;

    constructor() { }

    ngAfterViewInit(): void {
        this.draw();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.drawed) { return; }

        if (!changes.text) {
            this.d3_text.html(this.text);
        }

        if (changes.actif) {
            this.statusChange();
        }

        if (changes.x || changes.y || changes.r || changes.width) {
            this.changePosition();
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
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r)
            .attr('stroke', this.inactiveColor)
            .attr('stroke-width', 2)
            .attr('fill', 'white')
            .on('click', () => this.selected.emit(this.id));

        this.statusChange();
        this.drawed = true;
    }

    statusChange(): void {
        if (this.actif) {
            this.d3_circle
                .transition()
                .duration(300)
                .attr('stroke', this.activeColor);
            this.d3_rectangle
                .transition()
                .delay(300)
                .duration(500)
                .attr('height', this.heigthWhenOpen);
            this.d3_container
                .transition()
                .delay(300)
                .duration(500)
                .attr('height', this.heigthWhenOpen - this.r - this.textMargin);
        } else {
            this.d3_circle
                .transition()
                .delay(500)
                .duration(300)
                .attr('stroke', this.inactiveColor);
            this.d3_rectangle
                .transition()
                .duration(500)
                .attr('height', 0);
            this.d3_container
                .transition()
                .attr('height', 0);
        }
    }

    changePosition(): void {
        this.d3_rectangle
            .transition()
            .duration(750)
            .attr('x', this.x - this.width / 2)
            .attr('y', this.y)
            .attr('width', this.width);

        this.d3_container
            .transition()
            .duration(750)
            .attr('x', this.x - (this.width - this.textMargin) / 2)
            .attr('y', this.y + this.r + this.textMargin / 2)
            .attr('width', this.width - this.textMargin);

        this.d3_circle
            .transition()
            .duration(750)
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.r);
    }
}

