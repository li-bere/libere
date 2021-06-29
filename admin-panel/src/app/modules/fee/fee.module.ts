import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FeeRoutingModule } from "./fee.routing";
import { FeeListComponent } from "./fee-list/fee-list.component";

@NgModule({
  declarations: [FeeListComponent],
  imports: [CommonModule, FeeRoutingModule, FormsModule, ReactiveFormsModule],
})
export class FeeModule {}
