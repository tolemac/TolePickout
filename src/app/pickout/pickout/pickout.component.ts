import { Component, Input, OnInit, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';
import { PickoutAdapter } from './pickout-adapter';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

import { ChangeEvent } from '../virtual-scroll';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ng-pickout',
  template: `
    <ng-template #filterTemplate let-filter let-observable="observable">
      <input [style.width.%]="100" 
        [value]="filter.searchPattern" 
        (input)="filter.searchPattern = $event.target.value; observable.next(filter)"/>
    </ng-template>
    <ng-template #selectedTemplate let-selected>
      <div *ngIf="selected">
        {{selected.text}}
      </div>
      <div *ngIf="!selected">
        {{placeHolder}}
      </div>
    </ng-template>
    <ng-template #itemTemplate let-item>
      <div>
        {{item.text}}
      </div>
    </ng-template>

    <div #content class="content" [class.open]="isOpen" [tabindex]="0" 
      (keydown.escape)="close()" (keydown.enter)="open()" (keydown.ArrowDown)="open()">

      <div class="closed-zone" *ngIf="!isOpen">
        <button *ngIf="allowClear" class="open-close-button" tabindex="-1" (click)="clear()">clear</button>
        <button class="open-close-button" tabindex="-1"  (click)="$event.openEvent = true; toggleOpen();">open</button>
        <div class="current-zone" (click)="$event.openEvent = true; toggleOpen();">
          <ng-container *ngTemplateOutlet="selectedTemplate; context: {'$implicit': selected } ">
          </ng-container>
        </div>
      </div>
      <div class="dropdown-zone" *ngIf="isOpen">
        <div class="filter-zone">
          <button class="open-close-button" (click)="toggleOpen()" tabindex="-1">close</button>
          <div class="filter">
            <ng-container *ngTemplateOutlet="filterTemplate; context: { '$implicit': filterObj, observable: filterSubject }"></ng-container>
          </div>
        </div>
        <ng-template [ngIf]="useVirtualScroll">
          <div #virtualScroll="virtualScroll" virtualScroll class="items-zone"
              [items]="items" (update)="viewPortItems=$event" (end)="onItemsScrollEnd($event)">

            <ng-container *ngTemplateOutlet="internalItemTemplate; context: { $implicit: viewPortItems }"></ng-container>
            <div [tabindex]="0" *ngIf="hasMore" (click)="loadingItemClick()">
              <span *ngIf="loading">Loading ...</span>
              <span *ngIf="!loading">Click here for more items ...</span>
            </div>
            <div [tabindex]="0" *ngIf="!items.length">Mo items match ...</div>
            <div [style.position]="'fixed'" class="element-when-no-result">&nbsp;</div>
          </div>
        </ng-template>
        <ng-template [ngIf]="!useVirtualScroll">
          <div class="items-zone" (scroll)="onItemsScroll($event)">
            <ng-container *ngTemplateOutlet="internalItemTemplate; context: { $implicit: items }"></ng-container>
          </div>
        </ng-template>
      </div>
    </div>

    <ng-template #internalItemTemplate let-innerItems>
      <div [tabindex]="0" class="item" [class.selected]="isSelected(item)"
        *ngFor="let item of innerItems" (click)="itemClick(item)">
        <ng-container *ngTemplateOutlet="itemTemplate; context: { '$implicit' : item }"></ng-container>
      </div>          
    </ng-template>
  `
})
export class PickoutComponent implements OnInit {
  @ViewChild('content') contentElement: ElementRef;
  @ViewChild('virtualScroll') virtualScrollCmp: any;

  @Input() useVirtualScroll = false;
  @Input() allowClear = true;

  filterSubject = new Subject<any>();

  private _element: HTMLElement;
  private _isOpen = false;
  get isOpen() {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;

    if (this._isOpen) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  currentPage = 0;
  itemsPerpage = 20;
  hasMore = false;
  adapter: PickoutAdapter<any, any>;
  filterObj = { searchPattern: '' };
  items: any[] = [];
  placeHolder = 'Pick out one ...';
  loading: boolean;

  selected: any;

  constructor(elemRef: ElementRef, private _renderer: Renderer2) {
    this._element = elemRef.nativeElement;
  }

  ngOnInit() {
    this.filterSubject.debounceTime(300).subscribe(filter => this.filterChange(filter));
  }

  clear() {
    this.selected = null;
  }

  filterChange(filter: any) {
    console.log(new Date());
    this.items = [];
    this.currentPage = 0;
    this.getItems();
  }

  focusWithin() {
    let focusElem = document.activeElement;
    while (focusElem) {
      if (focusElem === this._element) {
        return true;
      }
      focusElem = focusElem.parentElement;
    }
    return false;
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  getItems() {
    if (this.currentPage === 0) {
      this.items = [];
    }
    this.loading = true;
    return this.adapter.getItems(this.filterObj, this.currentPage, this.itemsPerpage).then(result => {
      this.loading = false;
      this.items = this.items.concat(...result.items);
      this.hasMore = result.hasMore;
      setTimeout(() => {
        if (this.hasMore && !this.hasItemsZoneScroll()) {
          this.onItemsScrollEnd(null);
        }
      }, 20);
    }).catch((err) => {
      this.loading = false;
      this.items = [{ id: undefined, text: 'Error' }];
      throw err;
    });
  }

  loadingItemClick() {
    if (!this.loading) {
      this.getItems();
    }
  }

  scrollToItem(item: any) {
    setTimeout(() => {
      if (this.useVirtualScroll) {
        this.virtualScrollCmp.scrollInto(item);
      } else {
        const element = this._element.querySelector('.item.selected') as HTMLElement;
        if (!element) { return; }
        // element.focus();
        const scrollBox = this._element.querySelector('.items-zone');
        scrollBox.scrollTop = element.offsetTop - element.offsetHeight;
      }
    });
  }

  onOpen() {
    this._element.style.height = this._element.offsetHeight + 'px';
    if (!this.items.length) {
      this.getItems().then(() => {
        if (this.selected) {
          this.scrollToItem(this.selected);
        }
      });
    } else {
      this.scrollToItem(this.selected);
    }
  }

  onClose() {
    this._element.style.height = '';
  }

  itemClick(item: any) {
    this.selected = item;
    this.toggleOpen();
  }

  @HostListener('window:click', ['$event'])
  onWindowClickEvent(ev: MouseEvent) {
    if (!ev.openEvent && this.isOpen && !this.isInnerElement(ev.target as HTMLElement)) {
      this.close();
    }
  }

  isInnerElement(element: HTMLElement) {
    while (element) {
      if (element === this.contentElement.nativeElement) {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }

  nextPage() {
    if (this.hasMore) {
      this.currentPage++;
      this.getItems();
    }
  }

  onItemsScroll(ev: Event) {
    const element = event.target as HTMLElement;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // End of scroll
      if (this.hasMore) {
        this.nextPage();
      }
    }
  }
  onItemsScrollEnd(ev: ChangeEvent) {
    if (ev && ev.end !== this.items.length) {
      return;
    }
    this.nextPage();
  }

  private hasItemsZoneScroll() {
    const container = (this.contentElement.nativeElement as HTMLElement).querySelector('.items-zone'); // itemsZoneElement.nativeElement;
    return container.scrollHeight > (container.clientHeight + container.scrollTop);
  }

  isSelected(item: any) {
    if (!this.selected) {
      return false;
    }
    return item.object === this.selected.object;
  }

  /*
        focusNextElement: function () {
            //add all elements we want to include in our selection
            var focussableElements =
             'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
            if (document.activeElement && document.activeElement.form) {
                var focussable = Array.prototype.filter.call(document.activeElement.form.querySelectorAll(focussableElements),
                function (element) {
                    //check for visibility while always include the current activeElement
                    return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
                });
                var index = focussable.indexOf(document.activeElement);
                focussable[index + 1].focus();
            }
        }
  */
}
