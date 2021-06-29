import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonVerifiedPage } from './non-verified.page';

const routes: Routes = [
  {
    path: '',
    component: NonVerifiedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonVerifiedPageRoutingModule {}
