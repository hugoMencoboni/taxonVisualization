import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../core/services/data.service';

@Component({
    selector: 'app-legend',
    templateUrl: './legend.component.html',
    styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit, OnDestroy {
    subscription = new Subscription();

    levelDescription: Array<{ text: string, color: string, active?: boolean }>;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.levelDescription = this.dataService.getLevelDescription();
        this.subscription = this.dataService.activeLevel$().subscribe((activeLevel: number) => {
            this.levelDescription.forEach((l, index: number) => l.active = index + 1 === activeLevel);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
