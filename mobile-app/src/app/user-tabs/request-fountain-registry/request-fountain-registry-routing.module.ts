import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestFountainRegistryPage } from './request-fountain-registry.page';

const routes: Routes = [
  {
    path: '',
    component: RequestFountainRegistryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestFountainRegistryPageRoutingModule {}
