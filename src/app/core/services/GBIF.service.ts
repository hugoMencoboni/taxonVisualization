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

    protected loadChildren(id): Observable<Array<DataItem>> {
        return this.gbifApiService.getChildren(id).pipe(
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
                    return datas.map(d => {
                        return {
                            id: d.key,
                            text: d.scientificName,
                            shortName: d.canonicalName,
                            childrenLoaded: false,
                            parentId: d.parentKey,
                            children: [],
                            mediaUrl: info.splice(1, 0) ? info.splice(1, 0).filter(x => x) : []
                        };
                    });
                }
            })
        );
    }
}
