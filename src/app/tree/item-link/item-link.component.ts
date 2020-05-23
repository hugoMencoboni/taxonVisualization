import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { AttrTransition } from 'src/app/core/helpers/d3.helper';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: '[app-item-link]',
  template: '<svg:g #pathContainer></g>'
})
export class ItemLinkComponent implements OnChanges, AfterViewInit {
  @ViewChild('pathContainer')
  public pathContainer: ElementRef;

  @Input() originX: number;
  @Input() originY: number;

  @Input() destinationX: number;
  @Input() destinationY: number;

  @Input() actif = false;

  @Input() text: string;

  @Input() activeColor = '#3974b3';
  @Input() inactiveColor = '#bababa';

  initAtInfinit = true;
  id = uuidv4();

  private d3_path: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private d3_text: d3.Selection<SVGElement, {}, HTMLElement, any>;
  private d3_textPath: d3.Selection<SVGElement, {}, HTMLElement, any>;

  private drawed = false;

  constructor() { }

  ngAfterViewInit(): void {
    this.draw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.drawed) { return; }

    if (changes.originX || changes.originY || changes.destinationX || changes.destinationY) {
      this.changePosition();
    }

    if (changes.actif) {
      this.statusChange();
    }

    if (changes.text) {
      this.d3_textPath.text(this.text);
    }
  }

  private draw(): void {
    if (!this.pathContainer) { return; }

    const element = this.pathContainer.nativeElement;

    this.d3_path = d3.select(element).append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('id', this.id)
      .attr('d', this.setLine(this.initAtInfinit).toString());

    this.d3_text = d3.select(element).append('text')
      .attr('class', 'linklabel')
      .attr('dx', '-45')
      .attr('dy', '-5')
      .attr('text-anchor', 'end')
      .style('fill', this.inactiveColor);

    this.d3_textPath = this.d3_text.append('textPath')
      .attr('xlink:href', '#' + this.id)
      .attr('startOffset', '100%')
      .text(this.text);

    this.statusChange();

    if (this.initAtInfinit) {
      this.changePosition();
    }

    this.drawed = true;
  }

  statusChange(): void {
    if (this.actif) {
      this.d3_path.call(AttrTransition, [{ attr: 'stroke', newValue: this.activeColor }], 300);
    } else {
      this.d3_path.call(AttrTransition, [{ attr: 'stroke', newValue: this.inactiveColor }], 300, 500);
    }
  }

  changePosition(): void {
    this.d3_path.call(AttrTransition, [{ attr: 'd', newValue: this.setLine().toString() }], 750);
  }

  private setLine(xShift = false, yShift = false): d3.Path {
    const path = d3.path();
    const force = 50;

    path.moveTo(this.originX + (xShift ? 3000 : 0), this.originY + (yShift ? 3000 : 0));
    path.bezierCurveTo(
      this.originX + force + (this.destinationX - this.originX) / 2 + (xShift ? 3000 : 0),
      this.originY + (yShift ? 3000 : 0),
      this.originX - force + (this.destinationX - this.originX) / 2 + (xShift ? 3000 : 0),
      this.destinationY + (yShift ? 3000 : 0),
      this.destinationX + (xShift ? 3000 : 0),
      this.destinationY + (yShift ? 3000 : 0)
    );

    return path;
  }
}
