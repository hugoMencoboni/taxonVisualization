import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';

@Component({
    selector: 'app-legend',
    templateUrl: './legend.component.html',
    styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {
    levelDescription: Array<{ text: string, color: string }>;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        this.levelDescription = this.dataService.getLevelDescription();
    }
}
