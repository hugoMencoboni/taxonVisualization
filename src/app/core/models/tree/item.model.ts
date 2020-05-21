export interface BaseItem {
    id: number;
    text: string;
    shortName?: string;
    childrenLoaded: boolean;
    hasMoreChilds?: boolean;
    parentId: number;
    lvl: number;
    mediaUrl?: Array<string>;
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
    const treeItem = (new Object() as TreeItem);
    Object.assign(treeItem, data);

    treeItem.x = x;
    treeItem.y = y;
    treeItem.actif = false;
    treeItem.childrenId = data.children ? data.children.map(c => c.id) : [];
    treeItem.childrenLoaded = data.childrenLoaded;
    treeItem.parentId = data.parentId;
    treeItem.depth = parent && (parent.depth !== null || parent.depth !== undefined) ? parent.depth + 1 : 0;

    return treeItem;
}
