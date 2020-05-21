import { Injectable } from '@angular/core';
import { CacheModel } from '../models/cache.model';
import { DataItem } from '../models/tree/item.model';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    data = new Map<number, CacheModel>();

    getData(id: number): CacheModel {
        if (this.data.has(id)) {
            return this.data.get(id);
        }

        return { data: undefined, cached: false };
    }

    cacheData(id: number, data: DataItem): void {
        this.data.set(id, { data, cached: true });
    }
}
