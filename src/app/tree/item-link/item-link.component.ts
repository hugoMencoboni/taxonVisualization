import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: '[app-item-link]',
  template: '<svg:g #pathContainer></g>',
  styleUrls: ['./item-link.component.scss']
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
  inactiveColor = 'black';

  private d3_path;
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
      .attr('d', this.setLine().toString());

    this.statusChange();
    this.drawed = true;
  }

  statusChange(): void {
    if (this.actif) {
      this.d3_path
        .transition()
        .duration(300)
        .attr('stroke', this.activeColor);
    } else {
      this.d3_path
        .transition()
        .delay(500)
        .duration(300)
        .attr('stroke', this.inactiveColor);
    }
  }

  changePosition(): void {
    this.d3_path
      .transition()
      .duration(750)
      .attr('d', this.setLine().toString());
  }

  private setLine(): d3.Path {
    const path = d3.path();
    const force = 50;

    path.moveTo(this.originX, this.originY);
    path.bezierCurveTo(
      this.originX + force + (this.destinationX - this.originX) / 2,
      this.originY,
      this.originX - force + (this.destinationX - this.originX) / 2,
      this.destinationY,
      this.destinationX, this.destinationY);

    return path;
  }
}