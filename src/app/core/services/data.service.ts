import { Injectable } from '@angular/core';
import { BaseDataService } from '../models/baseDataService.model';
import { CacheService } from './cache.service';

@Injectable({
    providedIn: 'root',
    // useClass: TaxRefService
})
export class DataService extends BaseDataService {

    constructor(protected cacheService: CacheService) {
        super(cacheService);
    }
}
