import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { ShopsListComponent } from './shops-list/shops-list.component';
import { ViewShopComponent } from './view-shop/view-shop.component';

const routes: Routes = [
  {
    path: "",
    component: ShopsListComponent
  },
  {
    path: "view-shop",
    component: ViewShopComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopsRoutingModule {}
