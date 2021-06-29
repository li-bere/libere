import { Component, OnInit } from "@angular/core";

import { ActivatedRoute } from "@angular/router";

import { ShopI } from "./../../../core/models/shop";
import { ShopsService } from "./../../../core/services/shops/shops.service";

@Component({
  selector: "app-view-shop",
  templateUrl: "./view-shop.component.html",
  styleUrls: ["./view-shop.component.css"],
})
export class ViewShopComponent implements OnInit {
  loadingSpinner: boolean = true;
  shop: ShopI;

  constructor(
    private activatedRoute: ActivatedRoute,
    private shopsService: ShopsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.shopsService.getShop(params["id"]).subscribe((shop) => {
        console.log(shop);
        this.shop = shop;
        this.loadingSpinner = false;
      });
    });
  }
}
