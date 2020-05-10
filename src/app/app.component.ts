import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Taxa } from './core/models/taxRef/taxa.model';
import { TaxonApiService } from './core/services/taxon.api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  nameData: Array<Taxa>;
  childrenData: Array<Taxa>;
  imageRefs: Array<string>;
  form: FormGroup;

  dataTest: Taxa;

  constructor(private taxonApiService: TaxonApiService, private fb: FormBuilder) { }

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
}
