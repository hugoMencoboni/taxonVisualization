import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataItem } from '../models/tree/item.model';
import { TaxRefApiService } from './api/taxref.api.service';
import { CacheService } from './cache.service';
import { DataService } from './data.service';

@Injectable()
export class TaxRefService extends DataService {

    constructor(
        protected cacheService: CacheService,
        private taxRefApiService: TaxRefApiService
    ) {
        super(cacheService);
    }

    getSeed(): Observable<DataItem> {
        const seed = {
            id: 183818, // 349525,
            text: 'Biota',
            shortName: 'Biota',
            children: undefined,
            childrenLoaded: false,
            parentId: null
        };
        this.cacheService.cacheData(seed.id.toString(), seed);
        return of(seed);
    }

    protected loadChildren(id, offset?: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        return this.taxRefApiService.getChildren(id).pipe(
            map(datas => {
                if (datas) {
                    datas = datas.filter(d => d.parentId === id);
                    return {
                        data: datas.map(d => {
                            return {
                                id: d.id,
                                text: d.fullName,
                                shortName: d.vernacularClassName,
                                childrenLoaded: false,
                                parentId: d.parentId,
                                children: undefined
                            };
                        }),
                        fullyLoaded: true
                    };
                }
            })
        );
    }
}
