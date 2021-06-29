import { Component, OnInit } from "@angular/core";

import { ShopI } from "./../../../core/models/shop";

import { ToastService } from "./../../../core/services/toast/toast.service";
import { ShopsService } from "../../../core/services/shops/shops.service";
import { ErrorhandlerService } from "./../../../core/services/error-handler/error-handler.service";

@Component({
  selector: "app-shops-list",
  templateUrl: "./shops-list.component.html",
  styleUrls: ["./shops-list.component.css"],
})
export class ShopsListComponent implements OnInit {
  loadingSpinner: boolean = true;
  shops: Array<ShopI> = [];

  constructor(
    private shopsService: ShopsService,
    private toastService: ToastService,
    private errorHandlerService: ErrorhandlerService
  ) {}

  ngOnInit(): void {
    this.shopsService.getShops().subscribe((res) => {
      console.log(res);
      this.shops = res;
      this.loadingSpinner = false;
    });
  }

  toggleShopApproval(shopId: string, isApproved: boolean) {
    const approval = isApproved ? { isApproved: true } : { isApproved: false };
    const approvalMsg = isApproved
      ? "Shop has been approved"
      : "Shop has been rejected";
    this.shopsService
      .updateShop(shopId, approval)
      .then((res) => {
        this.toastService.success(approvalMsg);
      })
      .catch((err) => {
        this.errorHandlerService.displayErrorMessage("documentUpdateError");
      });
  }
}
