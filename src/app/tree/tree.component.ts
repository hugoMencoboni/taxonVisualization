import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataItem, GetTreeItem, TreeItem } from '../core/models/tree/item.model';
import { ColorService } from '../core/services/color.service';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, OnDestroy {
  subscription = new Subscription();

  focusPositionX = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) / 2;
  focusPositionY = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) / 2;

  distanceX = 350;
  distanceY = 120;

  heigthWhenOpen = 220;

  datas: Array<TreeItem>;

  constructor(private dataService: DataService, private colorService: ColorService) { }

  ngOnInit() {
    this.subscription = this.dataService.activeSeed$().subscribe((seed: DataItem) => {
      this.datas = [GetTreeItem(seed, this.focusPositionX, this.focusPositionY, null)];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  moveRigth(): void {
    this.datas.forEach(d => d.x -= 500);
  }

  moveLeft(): void {
    this.datas.forEach(d => d.x += 500);
  }

  moveUp(): void {
    this.datas.forEach(d => d.y += 300);
  }

  moveDown(): void {
    this.datas.forEach(d => d.y -= 300);
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
    if (parentId) {
      this.updateChildPosition(this.datas.find(x => x.id === parentId));
    }

    if (!item.childrenLoaded) {
      this.dataService.getChildren(item.id).pipe(take(1))
        .subscribe(
          (childrenData: { data: Array<DataItem>, fullyLoaded: boolean }) => {
            if (childrenData && childrenData.data) {
              this.addChild(item, childrenData.data);
            }

            item.childrenLoaded = true;
            item.hasMoreChilds = !childrenData.fullyLoaded;

            if (item.childrenId.length) {
              timer(1200).subscribe(() => {
                this.datas.forEach(d => {
                  d.x -= this.distanceX;
                });
              });
            }
          }
        );
    }
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

  private getChildPosition(id: number, parent?: TreeItem): { x: number, y: number } {
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
}
