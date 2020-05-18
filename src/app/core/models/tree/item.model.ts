export interface BaseItem {
    id: number;
    text: string;
    shortName?: string;
    childrenLoaded: boolean;
    parentId: number;
}

export interface DataItem extends BaseItem {
    children: Array<DataItem>;
}

export interface TreeItem extends BaseItem {
    x: number;
    y: number;
    childrenId: Array<number>;
    actif: boolean;
    depth: number;
}

export function GetTreeItem(data: DataItem, x: number, y: number, parent: TreeItem): TreeItem {
    return {
        id: data.id,
        text: data.text,
        x,
        y,
        actif: false,
        childrenId: data.children ? data.children.map(c => c.id) : undefined,
        childrenLoaded: data.childrenLoaded,
        parentId: data.parentId,
        depth: parent && parent.depth ? parent.depth + 1 : 0
    };
}
