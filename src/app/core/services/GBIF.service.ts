import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Taxa } from '../models/GBIF/taxa.model';
import { DataItem } from '../models/tree/item.model';
import { GBIFApiService } from './api/GBIF.api.service';
import { CacheService } from './cache.service';
import { ColorService } from './color.service';
import { DataService } from './data.service';

@Injectable()
export class GBIFService extends DataService {

    constructor(
        protected cacheService: CacheService,
        private gbifApiService: GBIFApiService,
        private colorService: ColorService
    ) {
        super(cacheService);
    }

    getSeeds(): Array<DataItem> {
        const seeds = [{
            id: 1,
            text: 'Animalia',
            shortName: 'Animalia',
            children: [],
            lvl: 1,
            childrenLoaded: false,
            parentId: null
        },
        {
            id: 2,
            text: 'Archaea',
            shortName: 'Archaea',
            children: [],
            lvl: 1,
            childrenLoaded: false,
            parentId: null
        },
        {
            id: 3,
            text: 'Bacteria',
            shortName: 'Bacteria',
            children: [],
            lvl: 1,
            childrenLoaded: false,
            parentId: null
        },
        {
            id: 0,
            text: 'Incertae sedis',
            shortName: 'Incertae sedis',
            children: [],
            lvl: 1,
            childrenLoaded: false,
            parentId: null
        }];
        seeds.forEach(s => this.cacheService.cacheData(s.id, s));
        return seeds;
    }

    getLevelDescription(): Array<{ text: string, color: string }> {
        return [
            { text: 'Kingdom', color: this.colorService.getColor(1) },
            { text: 'Phylum', color: this.colorService.getColor(2) },
            { text: 'Class', color: this.colorService.getColor(3) },
            { text: 'Order', color: this.colorService.getColor(4) },
            { text: 'Family', color: this.colorService.getColor(5) },
            { text: 'Genus', color: this.colorService.getColor(6) },
            { text: 'Species', color: this.colorService.getColor(7) }
        ];
    }

    protected loadChildren(id, offset?: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        const nbrChildLoaded = 20;
        return this.gbifApiService.getChildren(id, nbrChildLoaded, offset).pipe(
            flatMap(datas => {
                let mediaQueries = new Array<Observable<Array<string>>>();
                if (datas.length) {
                    mediaQueries = datas.filter(d => d.speciesKey).map(d => this.gbifApiService.getMediaUrl(d.key));
                }
                return forkJoin([of(datas), ...mediaQueries]);
            }),
            map((info: Array<any>) => {
                const datas = info[0] as Array<Taxa>;
                if (datas) {
                    const mediaUrl = [];
                    if (info.length > 1) {
                        info.slice(1, info.length).filter(x => x).forEach(urls => mediaUrl.push(...urls));
                    }

                    return {
                        data: datas.map(d => {
                            return {
                                id: d.key,
                                text: this.getText(d),
                                shortName: d.canonicalName,
                                childrenLoaded: false,
                                parentId: d.parentKey,
                                lvl: this.getLevel(d),
                                children: [],
                                mediaUrl
                            };
                        }),
                        fullyLoaded: datas.length < nbrChildLoaded
                    };
                }
            })
        );
    }

    private getLevel(taxon: Taxa): number {
        if (taxon.speciesKey) {
            return 7;
        }

        if (taxon.genusKey) {
            return 6;
        }

        if (taxon.familyKey) {
            return 5;
        }

        if (taxon.orderKey) {
            return 4;
        }

        if (taxon.classKey) {
            return 3;
        }

        if (taxon.phylumKey) {
            return 2;
        }

        if (taxon.kingdomKey) {
            return 1;
        }
    }

    private getText(taxon: Taxa): string {
        const textLine = new Array<string>();
        if (taxon.kingdom) {
            textLine.push(`<strong style='color:${this.colorService.getColor(1)}'>Kingdom :</strong> ${taxon.kingdom}`);
        }

        if (taxon.phylum) {
            textLine.push(`<strong style='color:${this.colorService.getColor(2)}'>Phylum :</strong> ${taxon.phylum}`);
        }

        if (taxon.class) {
            textLine.push(`<strong style='color:${this.colorService.getColor(3)}'>Class :</strong> ${taxon.class}`);
        }

        if (taxon.order) {
            textLine.push(`<strong style='color:${this.colorService.getColor(4)}'>Order :</strong> ${taxon.order}`);
        }

        if (taxon.family) {
            textLine.push(`<strong style='color:${this.colorService.getColor(5)}'>Family :</strong> ${taxon.family}`);
        }

        if (taxon.genus) {
            textLine.push(`<strong style='color:${this.colorService.getColor(6)}'>Genus :</strong> ${taxon.genus}`);
        }

        if (taxon.species) {
            textLine.push(`<strong style='color:${this.colorService.getColor(7)}'>Species :</strong> ${taxon.species}`);
        }

        if (taxon.scientificName) {
            textLine.push(`<strong>Scrintific name :</strong> ${taxon.scientificName}`);
        }

        return textLine.join('<br>');
    }
}
