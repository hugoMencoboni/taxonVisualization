export interface Item {
    id: number;
    x: number;
    y: number;
    text: string;
    shortName?: string;
    actif: boolean;
    parentId: number;
    childrenId: Array<number>;
    depth: number;
}
