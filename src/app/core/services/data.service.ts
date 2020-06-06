import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataItem } from '../models/tree/item.model';
import { CacheService } from './cache.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    protected activeItem = new BehaviorSubject<DataItem>(this.getSeeds()[0]);
    protected seed = new BehaviorSubject<DataItem>(this.getSeeds()[0]);
    protected newDatas = new Subject<Array<DataItem>>();

    newDatas$ = () => this.newDatas.asObservable();
    activeItem$ = () => this.activeItem.asObservable();
    activeLevel$ = () => this.activeItem.asObservable().pipe(map(data => data.lvl));

    changeActiveItem = (newActiveItemId: number) => {
        const cachedData = this.cacheService.getData(newActiveItemId);
        this.activeItem.next(cachedData.data);
    }

    activeSeed$ = () => this.seed.asObservable();

    changeSeed = (newSeedId: number) => {
        const seeds = this.getSeeds();
        const newSeed = seeds ? seeds.find(s => s.id === newSeedId) : undefined;
        if (newSeed) {
            this.seed.next(newSeed);
            this.activeItem.next(newSeed);
        }
    }

    constructor(protected cacheService: CacheService) { }

    search(pattern: string, parentId?: string): Observable<Array<any>> {
        throw new Error('Implement a source!');
    }

    loadItem(id: number): void {
        throw new Error('Implement a source!');
    }

    getSeeds(): Array<DataItem> {
        throw new Error('Implement a source!');
    }

    getChildren(id: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        const cachedData = this.cacheService.getData(id);

        if (cachedData.cached && cachedData.data.childrenLoaded) {
            return of({ data: cachedData.data.children, fullyLoaded: !cachedData.data.hasMoreChilds });
        } else {
            return this.loadChildren(id).pipe(
                map(childrenData => {
                    const data = childrenData.data;
                    if (data) {
                        data.forEach(d => this.cacheService.cacheData(d.id, d));
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

    getMoreChilds(id: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        const cachedData = this.cacheService.getData(id);
        const currentChildLoaded = cachedData.data.children.length;
        return this.loadChildren(id, currentChildLoaded).pipe(
            map(childrenData => {
                const data = childrenData.data;
                if (data) {
                    data.forEach(d => this.cacheService.cacheData(d.id, d));
                }
                cachedData.data.children.push(...data);
                cachedData.data.hasMoreChilds = !childrenData.fullyLoaded;
                this.cacheService.cacheData(id, cachedData.data);

                return childrenData;
            })
        );
    }

    protected loadChildren(id: number, offset?: number): Observable<{ data: Array<DataItem>, fullyLoaded: boolean }> {
        return throwError(new Error('Implement a source!'));
    }

    getLevelDescription(): Array<{ text: string, color: string }> {
        throw new Error('Implement a source!');
    }
}
