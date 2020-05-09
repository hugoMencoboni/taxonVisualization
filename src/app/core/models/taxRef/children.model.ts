import { Taxa } from './taxa.model';

export interface ChrildrenEmbedded {
    taxa: Taxa[];
}

export interface ChrildrenResponseEncapsulation {
    _embedded: ChrildrenEmbedded;
}
