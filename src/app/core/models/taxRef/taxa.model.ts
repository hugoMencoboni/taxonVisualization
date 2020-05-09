
export interface Taxa {
    id: number;
    referenceId: number;
    parentId: number;
    scientificName: string;
    authority: string;
    fullName: string;
    fullNameHtml: string;
    rankId: string;
    rankName: string;
    referenceName: string;
    referenceNameHtml: string;
    frenchVernacularName?: any;
    englishVernacularName?: any;
    genusName: string;
    familyName: string;
    orderName: string;
    className: string;
    phylumName: string;
    kingdomName: string;
    vernacularGenusName?: any;
    vernacularFamilyName: string;
    vernacularOrderName?: any;
    vernacularClassName: string;
    vernacularPhylumName: string;
    vernacularKingdomName: string;
    vernacularGroup1: string;
    vernacularGroup2: string;
    habitat: string;
    fr: string;
    gf: string;
    mar: string;
    gua: string;
    sm: string;
    sb: string;
    spm: string;
    may: string;
    epa: string;
    reu: string;
    sa: string;
    ta: string;
    nc: string;
    wf: string;
    pf: string;
    cli: string;
    taxrefVersion: string;
    _links: Links;
}

export interface Links {
    reference: Reference;
    parent: Parent;
    synonyms: Synonyms;
    classification: Classification;
    children: Children;
    vernacularNames: VernacularNames;
    media: Media;
    status: Status;
    interactions: Interactions;
    taxrefHistory: TaxrefHistory;
    externalIds: ExternalIds;
    taxonomicRank: TaxonomicRank;
    taxrefUri: TaxrefUri;
    inpnWebpage: InpnWebpage;
    habitat: Habitat;
}

export interface Reference {
    href: string;
}

export interface Parent {
    href: string;
}

export interface Synonyms {
    href: string;
}

export interface Classification {
    href: string;
}

export interface Children {
    href: string;
}

export interface VernacularNames {
    href: string;
}

export interface Media {
    href: string;
}

export interface Status {
    href: string;
}

export interface Interactions {
    href: string;
}

export interface TaxrefHistory {
    href: string;
}

export interface ExternalIds {
    href: string;
}

export interface TaxonomicRank {
    href: string;
}

export interface TaxrefUri {
    href: string;
}

export interface InpnWebpage {
    href: string;
}

export interface Habitat {
    href: string;
}
