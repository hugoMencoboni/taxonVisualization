import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataItem } from '../models/tree/item.model';
import { CacheService } from './cache.service';

@Injectable({
    providedIn: 'root',
    // useClass: TaxRefService
})
export class DataService {

    constructor(protected cacheService: CacheService) { }

    getChildren(id: string): Observable<Array<DataItem>> {
        const cachedData = this.cacheService.getData(id);

        if (cachedData.cached && cachedData.data.childrenLoaded) {
            return of(cachedData.data.children);
        } else {
            return this.loadChildren(id).pipe(
                tap(data => {
                    if (data) {
                        data.forEach(d => this.cacheService.cacheData(d.id.toString(), d));
                    }
                    cachedData.data.children = data;
                    cachedData.data.childrenLoaded = true;
                    this.cacheService.cacheData(id, cachedData.data);
                })
            );
        }
    }

    protected loadChildren(id: string): Observable<Array<DataItem>> {
        return throwError(new Error('Implement a source!'));
    }
}
