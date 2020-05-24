import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-family-item',
    template: `<svg preserveAspectRatio="xMinYMin meet" #itemContainer></svg>`
})
export class FamilyItemComponent implements OnChanges, AfterViewInit {

    constructor() { }
    @ViewChild('itemContainer')
    public itemContainer: ElementRef;

    @Input() width: number;
    @Input() height: number;

    @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

    @Input() actif = false;
    @Input() lineWidth = 1;
    @Input() lineWidthWhenActive = 2;
    @Input() color = '#3974b3';

    elements = new Array<d3.Selection<SVGElement, {}, HTMLElement, any>>();
    ellipseRatio = 0.6;
    littleEllypseRatio = 0.15;
    drawed = false;

    verticalOrientation = (): boolean => this.orientation === 'vertical';

    ngAfterViewInit(): void {
        if (!this.itemContainer) { return; }

        const element = this.itemContainer.nativeElement;

        d3.select(element)
            .attr('width', this.width)
            .attr('height', this.height);

        const ellipseX = this.verticalOrientation() ? this.width / 2 : (this.width / 2) * (1 + this.ellipseRatio);
        const ellipseY = this.verticalOrientation() ? (this.height / 2) * (1 + this.ellipseRatio) : this.height / 2;
        const ellipseRX = this.verticalOrientation() ?
            this.width / 2 - this.lineWidthWhenActive :
            (this.width / 2) * (1 - this.ellipseRatio) - this.lineWidthWhenActive;
        const ellipseRY = this.verticalOrientation() ?
            (this.height / 2) * (1 - this.ellipseRatio) - this.lineWidthWhenActive :
            this.height / 2 - this.lineWidthWhenActive;

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', ellipseX)
                .attr('cy', ellipseY)
                .attr('rx', ellipseRX)
                .attr('ry', ellipseRY)
                .call(this.commonAttributes())
        );

        // petites ellypses dans la grande
        const littleEllipseRX = ellipseRX * this.littleEllypseRatio;
        const littleEllipseRY = ellipseRY * this.littleEllypseRatio;

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', ellipseX)
                .attr('cy', ellipseY)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', this.verticalOrientation() ? ellipseX - ellipseRX * (2 / 3) : ellipseX)
                .attr('cy', this.verticalOrientation() ? ellipseY : ellipseY - ellipseRY * (2 / 3))
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', this.verticalOrientation() ? ellipseX + ellipseRX * (2 / 3) : ellipseX)
                .attr('cy', this.verticalOrientation() ? ellipseY : ellipseY + ellipseRY * (2 / 3))
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', this.verticalOrientation() ? ellipseX : ellipseX - ellipseRX * (2 / 3))
                .attr('cy', this.verticalOrientation() ? ellipseY - ellipseRY * (2 / 3) : ellipseY)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', this.verticalOrientation() ? ellipseX : ellipseX + ellipseRX * (2 / 3))
                .attr('cy', this.verticalOrientation() ? ellipseY + ellipseRY * (2 / 3) : ellipseY)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        const ratio = 1 / 2;
        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', ellipseX - ellipseRX * ratio)
                .attr('cy', ellipseY - ellipseRY * ratio)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', ellipseX + ellipseRX * ratio)
                .attr('cy', ellipseY + ellipseRY * ratio)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', ellipseX - ellipseRX * ratio)
                .attr('cy', ellipseY + ellipseRY * ratio)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', ellipseX + ellipseRX * ratio)
                .attr('cy', ellipseY - ellipseRY * ratio)
                .attr('rx', littleEllipseRX)
                .attr('ry', littleEllipseRY)
                .call(this.commonAttributes())
        );

        // petites ellypses origine
        const originRX = littleEllipseRX - this.lineWidthWhenActive > 0 ? littleEllipseRX - this.lineWidthWhenActive : 1;
        const originRY = littleEllipseRY - this.lineWidthWhenActive > 0 ? littleEllipseRY - this.lineWidthWhenActive : 1;

        this.elements.push(
            d3.select(element).append('ellipse')
                .attr('cx', this.verticalOrientation() ? ellipseX : littleEllipseRX)
                .attr('cy', this.verticalOrientation() ? littleEllipseRY : ellipseY)
                .attr('rx', originRX)
                .attr('ry', originRY)
                .call(this.commonAttributes())
                .attr('fill', this.color)
        );

        // paths
        this.elements.push(
            d3.select(element).append('path')
                .attr('d', this.setLine(
                    this.verticalOrientation() ? ellipseX - originRX : littleEllipseRX,
                    this.verticalOrientation() ? littleEllipseRY : ellipseY - originRY,
                    this.verticalOrientation() ? ellipseX - ellipseRX : ellipseX,
                    this.verticalOrientation() ? ellipseY : ellipseY - ellipseRY,
                    this.verticalOrientation()
                ).toString())
                .call(this.commonAttributes())
        );

        this.elements.push(
            d3.select(element).append('path')
                .attr('d', this.setLine(
                    this.verticalOrientation() ? ellipseX + originRX : littleEllipseRX,
                    this.verticalOrientation() ? littleEllipseRY : ellipseY + originRY,
                    this.verticalOrientation() ? ellipseX + ellipseRX : ellipseX,
                    this.verticalOrientation() ? ellipseY : ellipseY + ellipseRY,
                    this.verticalOrientation()
                ).toString())
                .call(this.commonAttributes())
        );

        this.drawed = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.drawed) { return; }

        if (changes.actif) {
            this.elements.forEach(e => e.attr('stroke-width', this.actif ? this.lineWidthWhenActive : this.lineWidth));
        }
    }
    private commonAttributes(): (element: d3.Selection<SVGElement, {}, HTMLElement, any>) => void {
        return (element: d3.Selection<SVGElement, {}, HTMLElement, any>) => {
            element.attr('stroke', this.color)
                .attr('stroke-width', this.actif ? this.lineWidthWhenActive : this.lineWidth)
                .attr('fill', 'transparent');
        };
    }

    private setLine(originX: number, originY: number, destinationX: number, destinationY: number, vertical: boolean): d3.Path {
        const path = d3.path();
        path.moveTo(originX, originY);
        path.bezierCurveTo(
            vertical ? originX : originX + (destinationX - originX) / 2,
            vertical ? originY + (destinationY - originY) / 2 : originY,
            vertical ? destinationX : originX + (destinationX - originX) / 2,
            vertical ? originY + (destinationY - originY) / 2 : destinationY,
            destinationX,
            destinationY
        );

        return path;
    }
}
