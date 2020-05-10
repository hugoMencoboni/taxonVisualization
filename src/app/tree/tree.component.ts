import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Taxa } from '../core/models/taxRef/taxa.model';
import { TaxonApiService } from '../core/services/taxon.api.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  nameData: Array<Taxa>;
  childrenData: Array<Taxa>;
  imageRefs: Array<string>;
  form: FormGroup;

  dataTest: Taxa;

  distanceX = 300;
  distanceY = 100;

  datas = [
    { id: Math.floor(Math.random() * 1000), x: 150, y: 50, text: 'voici du text', actif: false, children: [] }
  ];

  constructor(private taxonApiService: TaxonApiService, private fb: FormBuilder) { }

  create(): void {
    const newId = Math.floor(Math.random() * 1000);
    const rdmIndex = 0; // Math.floor(Math.random() * this.datas.length);
    const parent = this.datas[rdmIndex];
    this.addChild(parent, newId);
  }

  addChild(parent, childId) {
    parent.children = [...(parent.children || []), childId];
    const childPosition = this.getChildPosition(parent, childId);
    this.datas.push({
      id: childId,
      x: childPosition.x,
      y: childPosition.y,
      text: 'new one',
      actif: false,
      children: []
    });

    this.datas.forEach(d => {
      if (parent.children.includes(d.id)) {
        d.y = this.getChildPosition(parent, d.id).y;
      }
    });
  }

  getItem(id) {
    const item = this.datas.find(x => x.id === id);
    return item ? item[0] : { x: 0, y: 0 };
  }

  getChildPosition(parent, id): { x: number, y: number } {
    parent.children = parent.children || [];
    const childIndex = parent.children.indexOf(id);
    return {
      x: parent.x + this.distanceX,
      y: parent.y + (childIndex - (parent.children.length - 1) / 2) * this.distanceY
    };
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

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      children: [''],
      media: [''],
    });

    this.dataTest = {
      id: 5,
      referenceId: 15,
      parentId: 16,
      scientificName: 'scientificName',
      authority: '',
      fullName: '',
      fullNameHtml: '',
      rankId: '',
      rankName: '',
      referenceName: '',
      referenceNameHtml: '',
      frenchVernacularName: undefined,
      englishVernacularName: undefined,
      genusName: '',
      familyName: '',
      orderName: '',
      className: '',
      phylumName: '',
      kingdomName: '',
      vernacularGenusName: undefined,
      vernacularFamilyName: '',
      vernacularOrderName: undefined,
      vernacularClassName: '',
      vernacularPhylumName: '',
      vernacularKingdomName: '',
      vernacularGroup1: '',
      vernacularGroup2: '',
      habitat: '',
      fr: '',
      gf: '',
      mar: '',
      gua: '',
      sm: '',
      sb: '',
      spm: '',
      may: '',
      epa: '',
      reu: '',
      sa: '',
      ta: '',
      nc: '',
      wf: '',
      pf: '',
      cli: '',
      taxrefVersion: '',
      _links: undefined
    };
  }

  getByName() {
    this.taxonApiService.getByName(this.form.controls.name.value).subscribe(data => {
      this.nameData = data;
    });
  }

  getChildren() {
    this.taxonApiService.getChildren(this.form.controls.children.value).subscribe(data => {
      this.childrenData = data;
    });
  }

  getMedia() {
    this.taxonApiService.getMediaUrl(this.form.controls.media.value).subscribe(data => {
      this.imageRefs = data;
    });
  }

  onItemSelected(id: number): void {
    this.datas.forEach(d => d.actif = d.id === id ? !d.actif : false);
  }
}
