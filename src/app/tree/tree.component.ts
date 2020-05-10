import { Component } from '@angular/core';
import { Item } from '../core/models/tree/item.model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {
  distanceX = 300;
  distanceY = 100;

  heigthWhenOpen = 200;

  datas: Array<Item> = [
    { id: Math.floor(Math.random() * 1000), x: 150, y: 300, text: 'voici du text', actif: false, childrenId: [], parentId: null }
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

  create(): void {
    const newId = Math.floor(Math.random() * 1000);
    const rdmIndex = Math.floor(Math.random() * this.datas.length);
    const parent = this.datas[rdmIndex];
    this.addChild(parent, newId);
  }

  getItem(id: number): Item {
    return this.datas.find(x => x.id === id);
  }

  onItemSelected(id: number): void {
    // gestion du status
    this.datas.forEach(d => d.actif = d.id === id ? !d.actif : false);

    // mise à jour des coordonées
    const parentId = this.datas.find(x => x.id === id).parentId;
    if (parentId) {
      this.updateChildPosition(this.datas.find(x => x.id === parentId));
    }
  }

  private addChild(parent: Item, childId: number): void {
    parent.childrenId = [...(parent.childrenId || []), childId];
    const childPosition = this.getChildPosition(childId, parent);
    const newChild = {
      id: childId,
      x: childPosition.x,
      y: childPosition.y,
      text: 'new one',
      actif: false,
      childrenId: [],
      parentId: parent.id
    };
    this.datas.push(newChild);

    this.updateChildPosition(parent);
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
