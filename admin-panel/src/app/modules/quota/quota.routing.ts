import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { QuotaListComponent } from './quota-list/quota-list.component';

const routes: Routes = [
  {
    path: "",
    component: QuotaListComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuotaRoutingModule {}
