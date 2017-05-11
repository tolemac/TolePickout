import { Directive, Input } from '@angular/core';
import { PickoutComponent } from './pickout.component';
import { PickoutAdapter, AdapterResult, Filter } from './pickout-adapter';

// tslint:disable:directive-selector
@Directive({
    selector: 'ng-pickout[items]'
})
export class SimpleAdapterDirective implements PickoutAdapter<any, any> {
    @Input() valueProperty: string;
    @Input() textProperty: string;
    @Input() items: any[];

    constructor(private _pickoutComponent: PickoutComponent) {
        _pickoutComponent.adapter = this;
    }

    getItemValue(item: any) {
        return item[this.valueProperty];
    }
    getItemText(item: any): string {
        return item[this.textProperty];
    }
    getItems(filter: Filter, page: number, itemsPerpage: number): Promise<AdapterResult<any>> {
        const resItem = this.items
            .filter(item => (item[this.textProperty] as string).toUpperCase().indexOf(filter.searchPattern.toUpperCase()) >= 0)
            .slice(page * itemsPerpage, (page * itemsPerpage) + itemsPerpage)
            .map(item => {
                return {
                    value: item[this.valueProperty],
                    text: item[this.textProperty],
                    object: item
                };
            });
        return Promise.resolve({
            items: resItem,
            hasMore: resItem.length === itemsPerpage
        });
    }
    getItemByValue(value: any): Promise<any> {
        const resItem = this.items.find(item => item[this.valueProperty] === value);
        return Promise.resolve({
            value: resItem[this.valueProperty],
            text: resItem[this.textProperty],
            object: resItem
        });
    }
}
