import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataItem } from '../models/tree/item.model';
import { CacheService } from './cache.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(protected cacheService: CacheService) { }

    getSeed(): Observable<DataItem> {
        return throwError(new Error('Implement a source!'));
    }

    getChildren(id: string): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        const cachedData = this.cacheService.getData(id);

        if (cachedData.cached && cachedData.data.childrenLoaded) {
            return of({ data: cachedData.data.children, fullyLoaded: cachedData.data.hasMoreChilds });
        } else {
            return this.loadChildren(id).pipe(
                map(childrenData => {
                    const data = childrenData.data;
                    if (data) {
                        data.forEach(d => this.cacheService.cacheData(d.id.toString(), d));
                    }
                    cachedData.data.children = data;
                    cachedData.data.childrenLoaded = true;
                    cachedData.data.hasMoreChilds = !childrenData.fullyLoaded;
                    this.cacheService.cacheData(id, cachedData.data);

                    return childrenData;
                })
            );
        }
    }

    getMoreChilds(id: string): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        const cachedData = this.cacheService.getData(id);
        const currentChildLoaded = cachedData.data.children.length;
        return this.loadChildren(id, currentChildLoaded).pipe(
            map(childrenData => {
                const data = childrenData.data;
                if (data) {
                    data.forEach(d => this.cacheService.cacheData(d.id.toString(), d));
                }
                cachedData.data.children.push(...data);
                cachedData.data.hasMoreChilds = !childrenData.fullyLoaded;
                this.cacheService.cacheData(id, cachedData.data);

                return childrenData;
            })
        );
    }

    protected loadChildren(id: string, offset?: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        return throwError(new Error('Implement a source!'));
    }

    getLevelDescription(): Array<{ text: string, color: string }> {
        throw new Error('Implement a source!');
    }
}
