import { CacheService } from '../services/cache.service';

export class BaseDataService {
    protected cacheService: CacheService;

    constructor(cacheService: CacheService) {
        this.cacheService = cacheService;
    }
}
