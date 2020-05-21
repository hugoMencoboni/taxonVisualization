import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    getSeeds(): Array<DataItem> {
        const seed = {
            id: 183818, // 349525,
            text: 'Biota',
            shortName: 'Biota',
            children: [],
            lvl: 1,
            childrenLoaded: false,
            parentId: null
        };
        this.cacheService.cacheData(seed.id, seed);
        return [seed];
    }

    protected loadChildren(id: number, offset?: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
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
                                lvl: undefined,
                                children: [],
                                mediaUrl: []
                            };
                        }),
                        fullyLoaded: true
                    };
                }
            })
        );
    }
}
