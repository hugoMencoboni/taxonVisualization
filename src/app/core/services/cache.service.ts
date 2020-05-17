import { Injectable } from '@angular/core';
import { CacheModel } from '../models/cache.model';
import { DataItem } from '../models/tree/item.model';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    data = new Map<string, CacheModel>();

    getData(id: string): CacheModel {
        if (this.data.has(id)) {
            return this.data.get(id);
        }

        return { data: undefined, cached: false };
    }

    cacheData(id: string, data: DataItem): void {
        this.data.set(id, { data, cached: true });
    }
}
