import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotaListComponent } from './quota-list/quota-list.component';
import { QuotaRoutingModule } from './quota.routing';



@NgModule({
  declarations: [QuotaListComponent],
  imports: [
    CommonModule,
    QuotaRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QuotaModule { }
