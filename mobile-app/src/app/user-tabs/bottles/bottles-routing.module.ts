import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BottlesPage } from './bottles.page';

const routes: Routes = [
  {
    path: '',
    component: BottlesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BottlesPageRoutingModule {}
