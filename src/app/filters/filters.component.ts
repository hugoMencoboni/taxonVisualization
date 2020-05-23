import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../core/services/data.service';

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
    subscriptions = new Subscription();
    filters: FormGroup;
    seeds = new Array<{ id: number, label: string }>();
    seedLabel: string;

    constructor(private fb: FormBuilder, private dataService: DataService) { }

    ngOnInit(): void {
        const lvlDescriptions = this.dataService.getLevelDescription();
        this.seedLabel = lvlDescriptions ? lvlDescriptions[0].text : '';

        this.seeds = this.dataService.getSeeds().map(s => {
            return { id: s.id, label: s.shortName };
        });

        this.filters = this.fb.group({
            seed: [this.seeds.length ? this.seeds[0].id : undefined]
        });

        this.subscriptions.add(
            this.filters.controls.seed.valueChanges.subscribe(newSeed => this.dataService.changeSeed(newSeed))
        );
    }
}
