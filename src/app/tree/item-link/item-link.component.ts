import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

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

  activeColor = '#3974b3';
  inactiveColor = '#bababa';

  initAtInfinit = true;

  private d3_path: d3.Selection<SVGElement, {}, HTMLElement, any>;
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
  }

  private draw(): void {
    if (!this.pathContainer) { return; }

    const element = this.pathContainer.nativeElement;

    this.d3_path = d3.select(element).append('path')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('d', this.setLine(this.initAtInfinit).toString());

    const transitions = new Transitions();
    this.statusChange(transitions);

    if (this.initAtInfinit) {
      this.changePosition(transitions);
    }

    this.drawed = true;
  }

  statusChange(transitions = new Transitions()): void {
    if (this.actif) {
      if (!transitions.path) {
        transitions.path = this.d3_path
          .transition()
          .duration(300);
      }

      transitions.path
        .attr('stroke', this.activeColor);
    } else {

      if (!transitions.path) {
        transitions.path = this.d3_path
          .transition()
          .delay(500)
          .duration(300);
      }

      transitions.path
        .attr('stroke', this.inactiveColor);
    }
  }

  changePosition(transitions = new Transitions()): void {
    if (!transitions.path) {
      transitions.path = this.d3_path
        .transition()
        .duration(750);
    }

    transitions.path
      .attr('d', this.setLine().toString());
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

class Transitions {
  path: d3.Transition<SVGElement, {}, HTMLElement, any>;
}
