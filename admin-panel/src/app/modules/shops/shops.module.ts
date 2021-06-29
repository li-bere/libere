import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopsRoutingModule } from './shops.routing';

import { ShopsListComponent } from './shops-list/shops-list.component';
import { ViewShopComponent } from './view-shop/view-shop.component';



@NgModule({
  declarations: [ShopsListComponent, ViewShopComponent],
  imports: [
    CommonModule,
    ShopsRoutingModule
  ]
})
export class ShopsModule { }
