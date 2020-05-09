export interface Taxon {
    id: number;
    scientificName: string;
    fullNameHtml: string;
    referenceId: number;
    parentId: number;
    referenceNameHtml: string;
}

export interface Taxon2 {
    href: string;
}

export interface File {
    href: string;
}

export interface ThumbnailFile {
    href: string;
}

export interface Links {
    taxon: Taxon2;
    file: File;
    thumbnailFile: ThumbnailFile;
}

export interface Medium {
    taxon: Taxon;
    copyright: string;
    title?: any;
    licence: string;
    mimeType: string;
    _links: Links;
}

export interface MediaEmbedded {
    media: Medium[];
}

export interface MediaResponseEncapsulation {
    _embedded: MediaEmbedded;
}
