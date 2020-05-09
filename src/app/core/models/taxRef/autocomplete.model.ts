import { Taxa } from './taxa.model';

export interface AutocompleteEmbedded {
    taxa: Taxa[];
}

export interface Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}

export interface AutocompleteResponseEncapsulation {
    _embedded: AutocompleteEmbedded;
    page: Page;
}
