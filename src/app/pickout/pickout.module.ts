import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickoutComponent } from './pickout/pickout.component';
import { SimpleAdapterDirective } from './pickout/simple-adapter.directive';
import { VirtualScrollComponent } from './virtual-scroll';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PickoutComponent, SimpleAdapterDirective, VirtualScrollComponent],
  exports: [PickoutComponent, SimpleAdapterDirective]
})
export class PickoutModule {
}
