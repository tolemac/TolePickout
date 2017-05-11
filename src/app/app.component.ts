import { Component } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'app-root',
  template: `
  <h1>
    {{title}}
  </h1>
  <div>count {{pickout.items.length}}</div>
  <ng-pickout #pickout [items]="items" valueProperty="_id" textProperty="name"></ng-pickout>
  hola
  <div>
    {{pickout.selected?.object.name}}
    &nbsp;
  </div>
  <br/>
  <br/>
  <br/>
  <br/>
  <input/>
  `,
  styles: []
})
export class AppComponent {
  title = 'app works!';
  items = data; // .slice(0, 2);
}
