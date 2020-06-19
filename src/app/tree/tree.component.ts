import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { interval, Subject, Subscription } from 'rxjs';
import { map, pairwise, take } from 'rxjs/operators';
import { DataItem, GetTreeItem, TreeItem } from '../core/models/tree/item.model';
import { ColorService } from '../core/services/color.service';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription = new Subscription();

  @ViewChild('tree')
  public svg: ElementRef;
  svgWidth: number;
  svgHeight: number;
  svgPosition$ = new Subject<{ x: number, y: number }>();

  focusPositionX: number;
  focusPositionY: number;

  svgPositionX: number;
  svgPositionY: number;

  focusInitPositionX: number;
  focusInitPositionY: number;

  svgInitPositionX: number;
  svgInitPositionY: number;

  distanceX = 250;
  distanceY = 80;

  heigthWhenOpen = 190;

  datas: Array<TreeItem>;

  onMove = false;

  constructor(private dataService: DataService, private colorService: ColorService) {
    const svgDim = 10000;
    this.svgWidth = svgDim;
    this.svgHeight = svgDim;

    this.svgInitPositionX = (-1) * svgDim / 2;
    this.svgInitPositionY = (-1) * svgDim / 2;
    this.svgPositionX = this.svgInitPositionX;
    this.svgPositionY = this.svgInitPositionY;

    this.focusInitPositionX = svgDim / 2 + (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) / 2;
    this.focusInitPositionY = svgDim / 2 + (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) / 2;
    this.focusPositionX = this.focusInitPositionX;
    this.focusPositionY = this.focusInitPositionY;
  }

  ngOnInit() {
    this.subscription = this.dataService.activeSeed$().subscribe((seed: DataItem) => {
      this.datas = [GetTreeItem(seed, this.focusPositionX, this.focusPositionY, null)];
    });

    this.subscription.add(this.dataService.newDatas$().subscribe((newDatas: Array<DataItem>) => {
      const newSeedData = newDatas.find(d => !d.parentId);
      const newSeed = GetTreeItem(newSeedData, this.focusInitPositionX, this.focusInitPositionY, null);
      this.datas = [newSeed];

      let parent = newSeed;
      let child = newDatas.find(d => d.parentId === parent.id);
      while (child) {
        this.addChild(parent, [child]);
        parent = this.datas.find(d => d.id === child.id);
        child = newDatas.find(d => d.parentId === parent.id);
      }

      this.svgPositionX = this.svgInitPositionX;
      this.svgPositionY = this.svgInitPositionY;

      this.focusPositionX = this.focusInitPositionX;
      this.focusPositionY = this.focusInitPositionY;

      this.onItemSelected(newDatas.find(d => !d.children.length).id);
    }));

    this.subscription.add(this.svgPosition$.asObservable().pipe(pairwise()).subscribe(([previousPos, newPos]) => {
      if (previousPos) {
        const diffX = newPos.x - previousPos.x;
        const diffY = newPos.y - previousPos.y;
        if (Math.abs(diffX) + Math.abs(diffY) < 100) {
          const force = 1.5;
          this.svgPositionX += diffX * force;
          this.svgPositionY += diffY * force;
        }
      }
    }));
  }

  ngAfterViewInit(): void {
    const svg = this.svg.nativeElement;

    d3.select(svg)
      .on('mousedown', () => {
        if (d3.event.target.id === 'tree') {
          this.onMove = true;
        }
      })
      .on('mouseup', () => this.onMove = false)
      .on('mouseleave', () => this.onMove = false)
      .on('mouseout', () => {
        if (!d3.event.relatedTarget) {
          this.onMove = false;
        }
      });

    window.addEventListener('mousemove', (evt) => {
      if (this.onMove) {
        this.svgPosition$.next({ x: evt.screenX, y: evt.screenY });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getItem(id: number): TreeItem {
    return this.datas.find(x => x.id === id);
  }

  getColor(id: number): string {
    const item = this.getItem(id);
    return this.colorService.getColor(item.lvl);
  }

  onItemSelected(id: number): void {
    const item = this.getItem(id);

    this.resetSVGPosition();

    this.dataService.changeActiveItem(id);

    // Ne garde que les élément de profondeur inférieur à l'élément ou frère de l'élément
    const itemsToRemove = this.datas.map(d => {
      if (d.depth >= item.depth && d.id !== item.id) {
        return d.id;
      }
    }).filter(x => x);

    this.removeItems(itemsToRemove);

    // Focus: décalage si l'élément contient des enfants
    const itemPositionX = item.x;
    const itemPositionY = item.y;
    const focusPositionX = this.focusPositionX - +(item.childrenId.length > 0) * this.distanceX;
    this.datas.forEach(d => {
      d.x -= itemPositionX - focusPositionX;
      d.actif = d.id === id ? !d.actif : false;
    });

    // Décalage des cousins
    const parentId = this.getItem(id).parentId;
    if (parentId !== null && parentId !== undefined) {
      this.updateChildPosition(this.datas.find(x => x.id === parentId));
    }

    this.dataService.getChildren(item.id).pipe(take(1))
      .subscribe(
        (childrenData: { data: Array<DataItem>, fullyLoaded: boolean }) => {
          if (childrenData && childrenData.data) {
            this.addChild(item, childrenData.data);
          }

          item.childrenLoaded = true;
          item.hasMoreChilds = !childrenData.fullyLoaded;

          if (item.childrenId.length) {
            this.datas.forEach(d => {
              d.x -= this.distanceX;
            });
          }
        }
      );
  }

  addMoreChilds(id: number): void {
    const item = this.getItem(id);
    if (item.childrenLoaded && item.hasMoreChilds) {
      this.dataService.getMoreChilds(item.id).pipe(take(1))
        .subscribe(
          (childrenData: { data: Array<DataItem>, fullyLoaded: boolean }) => {
            if (childrenData && childrenData.data) {
              this.addChild(item, childrenData && childrenData.data);
            }

            item.hasMoreChilds = !childrenData.fullyLoaded;
            this.updateChildPosition(item);
          }
        );
    }
  }

  private addChild(parent: TreeItem, childs: Array<DataItem>): void {
    parent.childrenId = [...(parent.childrenId || []), ...childs.map(c => c.id)];

    childs.forEach(child => {
      const childPosition = this.getChildPosition(child.id, parent);
      const newChild = GetTreeItem(child, childPosition.x, childPosition.y, parent);
      this.datas.push(newChild);
    });
  }

  private removeItems(ids: Array<number>): void {
    if (ids.length) {
      this.datas = this.datas.filter(d => !ids.includes(d.id));
      this.datas.forEach(d => {
        if (d.childrenId) {
          const filtredChildren = d.childrenId.filter(childId => !ids.includes(childId));
          if (d.childrenId.length !== filtredChildren.length) {
            d.childrenLoaded = false;
          }
          d.childrenId = filtredChildren;
        }
      });
    }
  }

  private updateChildPosition(item: TreeItem): void {
    this.datas.forEach(d => {
      if (item.childrenId && item.childrenId.includes(d.id)) {
        d.y = this.getChildPosition(d.id, item).y;
        this.updateChildPosition(d);
      }
    });
  }

  private getChildPosition(id: number, parent: TreeItem): { x: number, y: number } {
    parent.childrenId = parent.childrenId || [];
    const childIndex = parent.childrenId.indexOf(id);
    const previousChild = childIndex === 0 ? undefined : this.datas.find(x => x.id === parent.childrenId[childIndex - 1]);
    let y;
    if (childIndex === 0) {
      y = parent.y + (- (parent.childrenId.length - 1) / 2) * this.distanceY;
    } else {
      y = previousChild.y + this.heigthWhenOpen * +previousChild.actif + this.distanceY;
    }
    return {
      x: parent.x + this.distanceX,
      y
    };
  }

  private resetSVGPosition() {
    if (this.svgPositionX !== this.svgInitPositionX || this.svgPositionY !== this.svgInitPositionY) {
      const transitionTime = 500; // en ms
      const diffX = Math.abs(this.svgInitPositionX - this.svgPositionX);
      const diffY = Math.abs(this.svgInitPositionY - this.svgPositionY);
      const transitionPositions = new Array<{ x: number, y: number }>();
      const diffMax = Math.max(diffX, diffY);
      let prevX = this.svgPositionX;
      let prevY = this.svgPositionY;
      for (let index = 0; index < diffMax; index++) {
        const x = this.svgPositionX + Math.floor(((index + 1) / diffMax) * (this.svgInitPositionX - this.svgPositionX));
        const y = this.svgPositionY + Math.floor(((index + 1) / diffMax) * (this.svgInitPositionY - this.svgPositionY));
        if (Math.abs(prevX - x) + Math.abs(prevY - y) > 20) {
          transitionPositions.push({ x, y });
          prevX = x;
          prevY = y;
        }
      }

      interval(transitionTime / transitionPositions.length)
        .pipe(
          take(transitionPositions.length),
          map(i => transitionPositions[i])
        )
        .subscribe(newPosition => {
          this.svgPositionX = newPosition.x;
          this.svgPositionY = newPosition.y;
        });
    }
  }
}
