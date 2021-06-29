import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopRankingPage } from './shop-ranking.page';

const routes: Routes = [
  {
    path: '',
    component: ShopRankingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRankingPageRoutingModule {}
