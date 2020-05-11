import { Component } from '@angular/core';
import { Item } from '../core/models/tree/item.model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {
  focusPositionX = window.screen.width / 2;
  focusPositionY = window.screen.height / 2;

  distanceX = 300;
  distanceY = 100;

  heigthWhenOpen = 200;

  datas: Array<Item> = [
    { id: Math.floor(Math.random() * 1000), x: 150, y: 300, text: 'voici du text', actif: false, childrenId: [], parentId: null, depth: 0 }
  ];

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

  create(nbrToCreate = 1): void {
    const parent = this.datas.find(x => x.actif);
    if (parent) {
      let nbr = 0;
      const childIds = new Array<number>();
      while (nbr < nbrToCreate) {
        childIds.push(Math.floor(Math.random() * 1000 + 1));
        nbr++;
      }
      this.addChild(parent, childIds);
    }
  }

  getItem(id: number): Item {
    return this.datas.find(x => x.id === id);
  }

  onItemSelected(id: number): void {
    const item = this.datas.find(x => x.id === id);
    const itemPositionX = item.x;
    const itemPositionY = item.y;

    // Ne garde que les élément de profondeur inférieur à l'élément ou frère de l'élément
    const itemsToRemove = this.datas.map(d => {
      if (d.depth >= item.depth && d.parentId !== item.parentId) {
        return d.id;
      }
    }).filter(x => x);

    this.removeItems(itemsToRemove);

    // Gestion du status
    this.datas.forEach(d => {
      d.x -= itemPositionX - this.focusPositionX;
      d.y -= itemPositionY - this.focusPositionY;
      d.actif = d.id === id ? !d.actif : false;
    });

    // Décalage des cousins
    const parentId = this.datas.find(x => x.id === id).parentId;
    if (parentId) {
      this.updateChildPosition(this.datas.find(x => x.id === parentId));
    }

    if (!item.childrenId.length) {
      this.create(Math.floor(Math.random() * 6));
    }
  }

  private addChild(parent: Item, childIds: Array<number>): void {
    parent.childrenId = [...(parent.childrenId || []), ...childIds];

    childIds.forEach(childId => {
      const childPosition = this.getChildPosition(childId, parent);
      const newChild = {
        id: childId,
        x: childPosition.x,
        y: childPosition.y,
        text: 'new one',
        actif: false,
        childrenId: [],
        parentId: parent.id,
        depth: parent.depth + 1
      };
      this.datas.push(newChild);
    });
  }

  private removeItems(ids: Array<number>): void {
    if (ids.length) {
      this.datas = this.datas.filter(d => !ids.includes(d.id));
      this.datas.forEach(d => {
        d.childrenId = d.childrenId.filter(childId => !ids.includes(childId));
      });
    }
  }

  private updateChildPosition(item: Item): void {
    this.datas.forEach(d => {
      if (item.childrenId.includes(d.id)) {
        d.y = this.getChildPosition(d.id, item).y;
        this.updateChildPosition(d);
      }
    });
  }

  private getChildPosition(id: number, parent?: Item): { x: number, y: number } {
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
