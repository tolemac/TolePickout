// tslint:disable:interface-over-type-literal
export type AdapterResult<Item> = {
    items: Item[];
    hasMore: boolean;
};

export type Filter = {
    [filterName: string]: any;
};

export interface PickoutAdapter<Item, Value> {
    getItemValue(item: Item): Value;
    getItemText(item: Item): string;
    getItems(filter: Filter, page: number, itemsPerpage: number): Promise<AdapterResult<Item>>;
    getItemByValue(value: Value): Promise<Item>;
}

