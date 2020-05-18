import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
            map(datas => {
                if (datas) {
                    return datas.map(d => {
                        return {
                            id: d.key,
                            text: d.scientificName,
                            shortName: d.canonicalName,
                            childrenLoaded: false,
                            parentId: d.parentKey,
                            children: []
                        };
                    });
                }
            })
        );
    }
}
