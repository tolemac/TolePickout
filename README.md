# TolePickout

> Experimental project! Not ready to use.
> Proyecto experimental, no preparado para ser usado.

Componente visual Angular (TypeScript) que permite seleccionar un elemento de una lista al estilo de [select2](https://select2.github.io/examples.html), [chossen](https://harvesthq.github.io/chosen), [selectize](http://selectize.github.io/selectize.js/) o [ng-select](https://basvandenberg.github.io/ng-select).

Requisitos generales del componente:

* En principio debe tener la apariencia de un combobox.
* Cuando coge el foco debe mostrar una lista de opciones a seleccionar y ser capaz de seleccionar uno o más elementos.
* Debe aceptar un template para renderizar cada item de la lista.
* Debe aceptar un template para renderizar el elemento seleccionado.
* Debe aceptar un template para una zona de filtro.
* Debe ser capaz de filtrar los elementos de la lista por medio de un objeto de filtro.
* Debe cargar elementos gradualmente haciendo uso de paginación incremental, carga unos cuantos y cuando llegas al final de la lista vuelve a pedir más.
* En dispositivos con pantallas pequeñas la lista de selección debe ocupar toda la pantalla.

Para facilitar su uso:
* Deberá contar con plantillas y opciones por defecto para que no sea complicado de usar en primera instancia.
* Deberá ser capaz de funcionar con una simple lista de strings o una simple lista de objetos.

Requisitos técnicos del componente:

* Debe implementar ValueAccesor para poderlo usar con NgModel.
* De la opción seleccionada debe extraer un valor, un identificador, que será el valor guardado en ngModel.
* Debe usar virtual-scroll para poder albergar todos los elementos que queramos. Ver estas referencias:  
https://medium.com/@rintoj/building-virtual-scroll-for-angular-2-7679ca95014e  
http://rintoj.github.io/angular2-virtual-scroll  
* Debe poder ser alimentado mediante un objeto adapter el cual debe cumplir con contrato como este:

````typescript
interface PickOutAdapter<Item> {
  getItemId(item: Item): any;
  getItemText(item: Item): any;
  getItems(filter: any) : Promise<AdapterResult<Item>>;
  getItemByValue(value: any): Promise<Item>;
}

type AdapterResult<Item> = {
  items: Item[];
  hasMore: boolean;
}
````

Su uso debe ser algo parecido a esto:
````html
<ng-pick-out [(ngModel)]="obj.personId" [items]="listOfItems" valueProperty="Id" textProperty="Name"></ng-pick-out>
<ng-pick-out [(ngModel)]="obj.personId" [adapter]="myPersonAdapter"></ng-pick-out>


<ng-template #selectedTpl let-selected>{{selected.name}}</ng-template>
<ng-template #itemTpl let-item><strong>{{item.name}}</strong> - {{item.surname}}</ng-template>
<ng-template #selectedTpl let-filter>
  <label>Name</label><input [(ngModel)]="filter.name"/>
</ng-template>

<ng-pick-out [(ngModel)]="obj.personId" required
  [adapter]="myPersonAdapter" 
  [selectedTemplate]="selectedTpl"
  [itemTemplate]="itemTpl"
  [filterTemplate]="filterTpl"></ng-pick-out>

````

