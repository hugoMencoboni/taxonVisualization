import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseDataService } from '../models/baseDataService.model';
import { DataItem } from '../models/tree/item.model';
import { TaxRefApiService } from './api/taxref.api.service';
import { CacheService } from './cache.service';

export class TaxRefService extends BaseDataService {

    constructor(
        protected cacheService: CacheService,
        private taxRefApiService: TaxRefApiService
    ) {
        super(cacheService);
    }

    protected loadChildren(id): Observable<Array<DataItem>> {
        return this.taxRefApiService.getChildren(id).pipe(
            map(datas => {
                return datas.map(d => {
                    return {
                        id: d.id,
                        text: d.fullName,
                        shortName: d.vernacularClassName,
                        childrenLoaded: false,
                        parentId: d.parentId,
                        children: undefined
                    };
                });
            })
        );
    }
}
