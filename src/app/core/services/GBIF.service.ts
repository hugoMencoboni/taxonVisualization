import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Taxa } from '../models/GBIF/taxa.model';
import { DataItem } from '../models/tree/item.model';
import { GBIFApiService } from './api/GBIF.api.service';
import { CacheService } from './cache.service';
import { DataService } from './data.service';

@Injectable()
export class GBIFService extends DataService {

    constructor(
        protected cacheService: CacheService,
        private gbifApiService: GBIFApiService
    ) {
        super(cacheService);
    }

    getSeed(): Observable<DataItem> {
        const seed = {
            id: 1,
            text: 'Animalia',
            shortName: 'Animalia',
            children: [],
            childrenLoaded: false,
            parentId: null
        };
        this.cacheService.cacheData(seed.id.toString(), seed);
        return of(seed);
    }

    protected loadChildren(id, offset?: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        const nbrChildLoaded = 20;
        return this.gbifApiService.getChildren(id, nbrChildLoaded, offset).pipe(
            flatMap(datas => {
                let mediaQueries = new Array<Observable<Array<string>>>();
                if (datas.length) {
                    mediaQueries = datas.map(d => this.gbifApiService.getMediaUrl(d.key));
                }
                return forkJoin([of(datas), ...mediaQueries]);
            }),
            map((info: Array<any>) => {
                const datas = info[0] as Array<Taxa>;
                if (datas) {
                    return {
                        data: datas.map(d => {
                            return {
                                id: d.key,
                                text: this.getText(d),
                                shortName: d.canonicalName,
                                childrenLoaded: false,
                                parentId: d.parentKey,
                                children: [],
                                mediaUrl: info.splice(1, 0) ? info.splice(1, 0).filter(x => x) : []
                            };
                        }),
                        fullyLoaded: datas.length < nbrChildLoaded
                    };
                }
            })
        );
    }

    private getText(taxon: Taxa): string {
        const textLine = new Array<string>();
        if (taxon.kingdom) {
            textLine.push(`<strong class='taxa-kingdom'>Kingdom :</strong> ${taxon.kingdom}`);
        }

        if (taxon.phylum) {
            textLine.push(`<strong class='taxa-phylum'>Phylum :</strong> ${taxon.phylum}`);
        }

        if (taxon.class) {
            textLine.push(`<strong class='taxa-class'>Class :</strong> ${taxon.class}`);
        }

        if (taxon.order) {
            textLine.push(`<strong class='taxa-order'>Order :</strong> ${taxon.order}`);
        }

        if (taxon.family) {
            textLine.push(`<strong class='taxa-family'>Family :</strong> ${taxon.family}`);
        }

        if (taxon.genus) {
            textLine.push(`<strong class='taxa-genus'>Genus :</strong> ${taxon.genus}`);
        }

        if (taxon.species) {
            textLine.push(`<strong class='taxa-species'>Species :</strong> ${taxon.species}`);
        }

        if (taxon.scientificName) {
            textLine.push(`<strong>Scrintific name :</strong> ${taxon.scientificName}`);
        }

        return textLine.join('<br>');
    }
}
