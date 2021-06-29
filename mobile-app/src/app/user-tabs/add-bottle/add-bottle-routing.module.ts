import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBottlePage } from './add-bottle.page';

const routes: Routes = [
  {
    path: '',
    component: AddBottlePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBottlePageRoutingModule {}
